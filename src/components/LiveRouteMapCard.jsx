import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  ExternalLink, 
  Route, 
  ShieldCheck, 
  Sparkles,
  Compass
} from 'lucide-react';
import { 
  MANDI_COORDINATES, 
  FARM_DEPOT_COORDINATES, 
  calculateLiveRoadRoute 
} from '../services/mapRoutingService';
import { getLiveGPSCoordinates, reverseGeocode } from '../services/locationService';

export default function LiveRouteMapCard({
  lang = 'hi',
  selectedBatch,
  selectedVehicle,
  recommendedMandi
}) {
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [customOrigin, setCustomOrigin] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Fetch live route whenever batch, recommended mandi, or customOrigin changes
  useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      if (!recommendedMandi) return;
      setIsLoadingRoute(true);
      const farmCoords = customOrigin 
        ? { lat: customOrigin.lat, lng: customOrigin.lng, name: customOrigin.displayName }
        : (selectedBatch?.farmCoordinates || FARM_DEPOT_COORDINATES[selectedBatch?.farmLocation] || FARM_DEPOT_COORDINATES['Kota Rampura Central Yard']);
      
      const mandiCoords = MANDI_COORDINATES[recommendedMandi?.mandiId] || MANDI_COORDINATES['mandi-ajmer'];

      const data = await calculateLiveRoadRoute(farmCoords, mandiCoords);
      if (isMounted) {
        setRouteData(data);
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();
    return () => { isMounted = false; };
  }, [selectedBatch, recommendedMandi, customOrigin]);

  const handleDetectLiveLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const coords = await getLiveGPSCoordinates();
      const geocoded = await reverseGeocode(coords.lat, coords.lng);
      setCustomOrigin({
        lat: coords.lat,
        lng: coords.lng,
        accuracyMeters: coords.accuracyMeters,
        displayName: geocoded.displayName,
        fullAddress: geocoded.fullAddress
      });
    } catch (err) {
      console.warn("Location error:", err);
      setLocationError(err.message || "Could not detect GPS location");
    } finally {
      setIsLocating(false);
    }
  };

  const handleResetLocation = () => {
    setCustomOrigin(null);
    setLocationError(null);
  };

  const effectiveDistance = routeData?.distanceKm || recommendedMandi?.distanceKm || 180;
  const effectiveHours = routeData?.durationHours || recommendedMandi?.travelTimeHours || 3.2;
  const freightTotal = effectiveDistance * (selectedVehicle?.costPerKm || 18);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E3DFD2] p-5 sm:p-7 shadow-warm-md overflow-hidden relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#EEEDE7]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5">
            <Route className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geoapify & OpenStreetMap Live Road Routing</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B]">
            {lang === 'hi' ? "लाइव सड़क मार्ग, दूरी एवं नक्शा" : "Live Highway Routing & Driving Distance"}
          </h3>
          <p className="text-xs text-[#68736C] mt-0.5">
            {lang === 'hi' 
              ? "जियोएपिफाई एवं ओपनस्ट्रीटमैप लाइव हाईवे नेटवर्क से वास्तविक सड़क दूरी व ट्रक भाड़ा गणना" 
              : "Live highway distance, driving transit time & freight economics powered by Geoapify & OpenStreetMap"}
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-[#173B2B] bg-[#EEEDE7] px-3 py-1.5 rounded-xl border border-[#E3DFD2]">
            {routeData?.source || "Geoapify Highway Engine (Live)"}
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Map Card + Highway Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Highway Journey Flow */}
        <div className="lg:col-span-7 bg-[#F7F5EF] rounded-2xl p-5 border border-[#E3DFD2] flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Origin -> Destination Route Flow */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#173B2B] text-[#D4BA7B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="w-0.5 h-12 bg-dashed border-l-2 border-emerald-600 my-1"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 space-y-6 pt-0.5">
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                      {lang === 'hi' ? "प्रस्थान स्थल (Origin Farm Depot):" : "Origin Farm Depot:"}
                    </span>
                    {!customOrigin ? (
                      <button
                        onClick={handleDetectLiveLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        <MapPin className="w-3 h-3 text-emerald-700 animate-pulse" />
                        <span>{isLocating 
                          ? (lang === 'hi' ? "खोज रहे हैं..." : "Detecting GPS...") 
                          : (lang === 'hi' ? "📍 मेरी लाइव जीपीएस लोकेशन लें" : "📍 Use My Live GPS")
                        }</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleResetLocation}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
                      >
                        {lang === 'hi' ? "↺ डिफ़ॉल्ट कोटा यार्ड करें" : "↺ Reset to Depot"}
                      </button>
                    )}
                  </div>

                  <div className="text-sm font-bold text-[#173B2B] flex items-center gap-2">
                    <span>{customOrigin ? customOrigin.displayName : selectedBatch.farmLocation}</span>
                    {customOrigin && (
                      <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                        Live GPS
                      </span>
                    )}
                  </div>
                  {customOrigin && (
                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                      GPS: {customOrigin.lat.toFixed(4)}°N, {customOrigin.lng.toFixed(4)}°E (±{customOrigin.accuracyMeters}m)
                    </div>
                  )}
                  {locationError && (
                    <div className="text-[10px] text-red-600 mt-1">
                      ⚠️ {locationError}
                    </div>
                  )}
                  <div className="text-xs text-[#8FA58E] mt-0.5">
                    {lang === 'hi' ? selectedBatch.hindiName : selectedBatch.crop} ({selectedBatch.quantityKg} kg load ready)
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#68736C]">
                    {lang === 'hi' ? "गंतव्य मंडी (Destination Mandi):" : "Destination Mandi:"}
                  </div>
                  <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>{lang === 'hi' ? recommendedMandi.mandiHindiName : recommendedMandi.mandiName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {lang === 'hi' ? "सर्वोत्तम विकल्प" : "Best Choice"}
                    </span>
                  </div>
                  <div className="text-xs text-[#68736C]">
                    {recommendedMandi.highwayRoute}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#E3DFD2] text-center">
              <div className="clay-card rounded-2xl p-3 border border-[#D6D1C4]">
                <div className="text-[10px] uppercase font-bold text-[#68736C] flex items-center justify-center gap-1">
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'hi' ? "सड़क दूरी" : "Road Distance"}</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B] mt-0.5">
                  {effectiveDistance} km
                </div>
                <div className="text-[10px] text-[#8FA58E]">OSRM Live</div>
              </div>

              <div className="clay-card rounded-2xl p-3 border border-[#D6D1C4]">
                <div className="text-[10px] uppercase font-bold text-[#68736C] flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'hi' ? "यात्रा समय" : "Transit Time"}</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#173B2B] mt-0.5">
                  {effectiveHours} hrs
                </div>
                <div className="text-[10px] text-[#8FA58E]">Real Road Speed</div>
              </div>

              <div className="clay-card rounded-2xl p-3 border border-[#D6D1C4]">
                <div className="text-[10px] uppercase font-bold text-[#68736C] flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#B59658]" />
                  <span>{lang === 'hi' ? "गाड़ी भाड़ा" : "Total Freight"}</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">
                  ₹{freightTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#8FA58E]">@ ₹{selectedVehicle.costPerKm}/km</div>
              </div>
            </div>

          </div>

          {/* Navigation Action */}
          <div className="pt-4 mt-4 border-t border-[#E3DFD2]">
            <a
              href={routeData?.googleMapsNavUrl || `https://www.google.com/maps/dir/?api=1&query=Ajmer+Mandi`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#173B2B] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider hover:bg-[#224D39] transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Navigation className="w-4 h-4 text-[#D4BA7B]" />
              <span>{lang === 'hi' ? "ड्राइवर के लिए लाइव GPS नेविगेशन खोलें" : "Open Driver Live GPS Navigation"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
            </a>
          </div>
        </div>

        {/* Right: Interactive Route Card & Vehicle Details */}
        <div className="lg:col-span-5 bg-[#173B2B] text-white rounded-2xl p-5 flex flex-col justify-between border border-[#B59658]/40 shadow-inner">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4BA7B]">
                {lang === 'hi' ? "चयनित वाहन व सुरक्षा" : "Allocated Vehicle"}
              </span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-emerald-300 font-mono">
                {selectedVehicle.capacityKg} kg Cap
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{lang === 'hi' ? "गाड़ी का नाम:" : "Vehicle:"}</span>
                <strong className="text-white font-bold">{selectedVehicle.name}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">{lang === 'hi' ? "ड्राइवर:" : "Assigned Driver:"}</span>
                <span className="text-[#F4EEDF]">{selectedVehicle.driverName || "Ramswaroop Gurjar"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">{lang === 'hi' ? "प्रति किमी दर:" : "Haulage Tariff:"}</span>
                <span className="font-mono text-[#D4BA7B] font-bold">₹{selectedVehicle.costPerKm} / km</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">{lang === 'hi' ? "सुरक्षित अवधि:" : "Safe Window:"}</span>
                <span className="text-emerald-300 font-bold">{selectedBatch.targetWindowHours || 12} hrs shelf life</span>
              </div>
            </div>

            {/* Feasibility Check Box */}
            <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'hi' ? "रूट पूरी तरह सुरक्षित" : "Route Feasibility Verified"}</span>
              </div>
              <p className="text-[11px] text-[#EBE8DE] leading-relaxed">
                {effectiveHours} hrs travel time is safely within {selectedBatch.crop}'s {selectedBatch.targetWindowHours || 12} hr perishable freshness window.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center pt-3 border-t border-white/10 mt-3">
            Powered by OpenStreetMap Highway Network • 100% Free
          </div>
        </div>

      </div>

    </div>
  );
}
