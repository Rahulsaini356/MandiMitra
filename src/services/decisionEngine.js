// WayEzee Decision Engine — Deterministic Agricultural Logistics & Arbitrage Solver
// Follows Hackathon Problem Statement #04 formula:
// Net Return = Gross Produce Value - Haulage Freight - Mandi Fees - Expected Spoilage Loss
// Fully separates deterministic mathematical planning from LLM reasoning.

import { MASTER_CROPS_DIRECTORY } from '../data/mandisData';
import { 
  FARM_DEPOT_COORDINATES, 
  MANDI_COORDINATES, 
  estimateRoadDistanceAndHours 
} from './mapRoutingService';

/**
 * Deterministic financial and feasibility evaluation for a single mandi candidate
 */
export function calculateMandiOption({
  mandi,
  batch,
  vehicle,
  priceOverride = null,
  transportCostPerKmOverride = null,
}) {
  const crop = batch.crop;
  const quantityKg = Number(batch.quantityKg) || 1000;

  // 1. Resolve unit price (per kg) from AGMARKNET verified records or master directory
  let unitPrice = priceOverride !== null ? Number(priceOverride) : null;
  if (unitPrice === null) {
    if (mandi.modalPricePerKg && mandi.modalPricePerKg[crop] !== undefined) {
      unitPrice = mandi.modalPricePerKg[crop];
    } else {
      const cropInfo = MASTER_CROPS_DIRECTORY?.find(c => 
        c.crop.toLowerCase() === (crop || '').toLowerCase() || 
        c.id === (crop || '').toLowerCase() || 
        c.hindiName === crop
      );
      if (cropInfo) {
        const spread = mandi.code === 'MANDI-A' ? 2 : mandi.code === 'MANDI-B' ? 0 : mandi.code === 'MANDI-C' ? -3 : -1;
        unitPrice = Math.max(10, cropInfo.basePrice + spread);
      } else {
        unitPrice = 22;
      }
    }
  }

  // 2. Dynamic Location-Aware Road Distance & Travel Hours calculation
  let distanceKm = mandi.distanceKm;
  let travelTimeHours = mandi.travelTimeHours;

  const farmCoords = (batch.farmCoordinates && typeof batch.farmCoordinates === 'object') 
    ? batch.farmCoordinates 
    : (FARM_DEPOT_COORDINATES[batch.farmLocation] || null);

  const mandiCoords = MANDI_COORDINATES[mandi.id] || null;

  if (farmCoords && mandiCoords) {
    const estimated = estimateRoadDistanceAndHours(farmCoords, mandiCoords);
    distanceKm = estimated.distanceKm;
    travelTimeHours = estimated.travelTimeHours;
  }

  const costPerKm = transportCostPerKmOverride !== null ? Number(transportCostPerKmOverride) : vehicle.costPerKm;

  // 3. Gross Revenue
  const grossRevenue = Math.round(quantityKg * unitPrice);

  // 4. Transport Freight Expense (Real Road Distance * Cost per KM)
  const transportCost = Math.round(distanceKm * costPerKm);

  // 5. Mandi Fees & Charges (Fixed Yard Fee + APMC Cess + Handling per Quintal)
  const cess = (grossRevenue * (mandi.mandiCessPercent || 1.0)) / 100;
  const handling = ((quantityKg / 100) * (mandi.handlingChargePerQuintal || 15));
  const totalMandiFees = Math.round((mandi.fixedMandiFee || 200) + cess + handling);

  // 6. Expected Perishable Spoilage Loss (Shelf Life vs Road Transit + Yard Queue)
  const totalTransitHours = Number((travelTimeHours + (mandi.currentQueueWaitMin / 60)).toFixed(1));
  const spoilageFraction = Math.min(0.20, (batch.spoilageRatePerHour || 0.001) * totalTransitHours);
  const spoilageLossKg = Math.round(quantityKg * spoilageFraction);
  const expectedSpoilageLossRs = Math.round(spoilageLossKg * unitPrice);

  // 7. Net Pocket Return (Farmer Final Take-Home Cash)
  const netReturn = grossRevenue - transportCost - totalMandiFees - expectedSpoilageLossRs;
  const netReturnPerKg = Number((netReturn / quantityKg).toFixed(2));

  // 8. 4-Point Logistics & Economic Feasibility Check
  const capacityFeasible = vehicle.capacityKg >= quantityKg;
  const safeWindow = batch.targetWindowHours || 12;
  const shelfLifeFeasible = totalTransitHours <= safeWindow;
  const mandiCapacityFeasible = (mandi.intakeCapacityKg || 10000) >= quantityKg;
  const positiveReturnFeasible = netReturn > 0;

  const isFeasible = capacityFeasible && shelfLifeFeasible && mandiCapacityFeasible && positiveReturnFeasible;

  const feasibilityReport = {
    isFeasible,
    vehicleCapacity: {
      passed: capacityFeasible,
      detail: capacityFeasible
        ? `Vehicle capacity (${vehicle.capacityKg} kg) accommodates batch (${quantityKg} kg)`
        : `Batch (${quantityKg} kg) exceeds vehicle capacity (${vehicle.capacityKg} kg)`
    },
    travelTime: {
      passed: shelfLifeFeasible,
      detail: shelfLifeFeasible
        ? `Transit ${totalTransitHours.toFixed(1)} hrs is well within fresh window (${safeWindow} hrs)`
        : `Transit ${totalTransitHours.toFixed(1)} hrs exceeds safe window (${safeWindow} hrs)`
    },
    mandiIntake: {
      passed: mandiCapacityFeasible,
      detail: mandiCapacityFeasible
        ? `Mandi intake capacity (${mandi.intakeCapacityKg} kg) open for allocation`
        : `Mandi yard is near capacity ceiling`
    },
    profitFeasibility: {
      passed: positiveReturnFeasible,
      detail: positiveReturnFeasible
        ? `Estimated net return is positive (₹${netReturn.toLocaleString('en-IN')})`
        : `Loss risk: transport & fees exceed produce value`
    }
  };

  return {
    mandiId: mandi.id,
    mandiCode: mandi.code,
    mandiName: mandi.name,
    mandiHindiName: mandi.hindiName,
    district: mandi.district || mandi.name.split(' ')[0],
    hubName: mandi.hubName,
    distanceKm,
    travelTimeHours,
    queueWaitMin: mandi.currentQueueWaitMin,
    totalTransitHours,
    unitPrice,
    quantityKg,
    grossRevenue,
    transportCost,
    totalMandiFees,
    mandiFeesBreakdown: {
      fixed: mandi.fixedMandiFee,
      cess: Math.round(cess),
      handling: Math.round(handling)
    },
    spoilageLossKg,
    expectedSpoilageLossRs,
    netReturn,
    netReturnPerKg,
    feasibilityReport,
    isFeasible,
    dataSource: mandi.dataSource,
    lastUpdated: mandi.lastUpdatedText,
    highwayRoute: mandi.highwayRoute
  };
}

/**
 * Evaluate all candidate mandis dynamically from available market data
 * Selects Recommendation 1 (Highest Net Return) & Recommendation 2 (Best Distinct Alternative)
 */
export function evaluateAllMandis({
  mandis,
  batch,
  vehicle,
  priceOverrides = {},
  transportCostOverride = null,
}) {
  // 1. Calculate each candidate market option
  const evaluated = mandis.map(mandi => {
    const override = priceOverrides[mandi.id] !== undefined ? priceOverrides[mandi.id] : null;
    return calculateMandiOption({
      mandi,
      batch,
      vehicle,
      priceOverride: override,
      transportCostPerKmOverride: transportCostOverride
    });
  });

  // 2. Sort all candidates by net return descending
  const sorted = [...evaluated].sort((a, b) => b.netReturn - a.netReturn);
  sorted.forEach((item, index) => {
    item.rank = index + 1;
  });

  // 3. Partition feasible vs infeasible candidates
  const feasible = sorted.filter(m => m.isFeasible);
  const infeasible = sorted.filter(m => !m.isFeasible);

  // 4. Recommendation 1 — Highest Estimated Net Return among feasible candidates
  const recommendation1 = feasible.length > 0 ? feasible[0] : sorted[0];

  // 5. Recommendation 2 — Best Distinct Alternative
  // Evaluates trade-offs (net return, travel distance, transport cost, freshness/spoilage)
  let recommendation2 = null;
  let tradeOffs = null;

  if (feasible.length >= 2) {
    const remainingFeasible = feasible.slice(1);

    // Score remaining feasible candidates considering proximity / freshness vs net return
    let bestAltCandidate = remainingFeasible[0];
    let highestScore = -Infinity;

    for (const cand of remainingFeasible) {
      // Net return weight 65%, proximity / shorter transit weight 35%
      const returnRatio = cand.netReturn / (recommendation1.netReturn || 1);
      const proximityFactor = Math.max(0, 1 - (cand.distanceKm / 350));
      const score = (returnRatio * 0.65) + (proximityFactor * 0.35);

      if (score > highestScore) {
        highestScore = score;
        bestAltCandidate = cand;
      }
    }

    recommendation2 = bestAltCandidate;

    // Structured Trade-Off Analysis between Recommendation 1 and Recommendation 2
    const netReturnDiff = recommendation1.netReturn - recommendation2.netReturn;
    const distanceDiff = Math.abs(recommendation1.distanceKm - recommendation2.distanceKm);
    const transportSavings = recommendation2.transportCost < recommendation1.transportCost 
      ? (recommendation1.transportCost - recommendation2.transportCost)
      : 0;
    const transitTimeSaved = recommendation2.totalTransitHours < recommendation1.totalTransitHours
      ? Number((recommendation1.totalTransitHours - recommendation2.totalTransitHours).toFixed(1))
      : 0;

    tradeOffs = {
      hasAlternative: true,
      netReturnDiff,
      distanceDiff,
      transportSavings,
      transitTimeSaved,
      headlinePriceDiff: recommendation1.unitPrice - recommendation2.unitPrice,
      summaryEn: netReturnDiff > 0
        ? `${recommendation1.mandiName} yields ₹${netReturnDiff.toLocaleString('en-IN')} higher net cash. However, ${recommendation2.mandiName} (${recommendation2.distanceKm} km away) ${transitTimeSaved > 0 ? `saves ${transitTimeSaved}h in transit and ₹${transportSavings.toLocaleString('en-IN')} in freight` : `provides an active alternative terminal market`}.`
        : `Both options provide competitive cash returns with distinct highway corridors.`,
      summaryHi: netReturnDiff > 0
        ? `${recommendation1.mandiHindiName} से ₹${netReturnDiff.toLocaleString('en-IN')} अधिक शुद्ध मुनाफा मिलता है। वहीं ${recommendation2.mandiHindiName} (${recommendation2.distanceKm} किमी) ${transitTimeSaved > 0 ? `${transitTimeSaved} घंटे पहले पहुंचती है और ₹${transportSavings.toLocaleString('en-IN')} भाड़ा बचाती है` : `एक विश्वसनीय वैकल्पिक मंडी विकल्प है`}।`
        : `दोनों मंडियां अलग-अलग हाईवे रूट पर बेहतरीन मुनाफा देती हैं।`
    };
  }

  // 6. Build dynamic rationale for Recommendation 1
  const whyRecommended = [];
  if (recommendation2) {
    const returnDelta = recommendation1.netReturn - recommendation2.netReturn;
    whyRecommended.push(`Higher final return: yields +₹${returnDelta.toLocaleString('en-IN')} more than ${recommendation2.mandiName}.`);
    if (recommendation1.transportCost < recommendation2.transportCost) {
      const transportSavings = recommendation2.transportCost - recommendation1.transportCost;
      whyRecommended.push(`Superior freight economics: saves ₹${transportSavings.toLocaleString('en-IN')} in haulage cost.`);
    }
  }

  if (recommendation1.totalTransitHours <= 4.0) {
    whyRecommended.push(`Fresh transit window: ${recommendation1.travelTimeHours}h driving preserves Grade-A firmness and prevents weight loss.`);
  }
  whyRecommended.push(`Logistics feasibility: ${vehicle.name} has sufficient capacity (${vehicle.capacityKg} kg) for this load.`);
  whyRecommended.push(`Optimal yard gate queue: ~${recommendation1.queueWaitMin} min estimated wait.`);

  // 7. Dynamic rejection reasons for other candidates (zero hardcoded names)
  const rejected = sorted.filter(m => 
    m.mandiId !== recommendation1.mandiId && 
    (!recommendation2 || m.mandiId !== recommendation2.mandiId)
  );

  rejected.forEach(alt => {
    const delta = recommendation1.netReturn - alt.netReturn;
    let reason = "";
    if (!alt.feasibilityReport.travelTime.passed) {
      reason = `Infeasible transit: ${alt.totalTransitHours} hrs exceeds safe freshness limit of ${batch.targetWindowHours || 12} hrs.`;
    } else if (!alt.feasibilityReport.vehicleCapacity.passed) {
      reason = `Capacity exceeded: load (${batch.quantityKg} kg) exceeds vehicle payload.`;
    } else if (alt.unitPrice > recommendation1.unitPrice) {
      reason = `Headline rate illusion: ₹${alt.unitPrice}/kg looks higher, but long haul (${alt.distanceKm} km, freight ₹${alt.transportCost.toLocaleString('en-IN')}) erodes net margin by ₹${delta.toLocaleString('en-IN')}.`;
    } else if (alt.distanceKm < recommendation1.distanceKm) {
      reason = `Nearer location (${alt.distanceKm} km), but lower mandi market rate (₹${alt.unitPrice}/kg) leaves ₹${delta.toLocaleString('en-IN')} less profit than ${recommendation1.mandiName}.`;
    } else {
      reason = `Sub-optimal return: net pocket cash is ₹${delta.toLocaleString('en-IN')} lower due to combined distance and auction fees.`;
    }
    alt.rejectionReason = reason;
  });

  return {
    recommended: recommendation1,
    recommendation1,
    bestAlternative: recommendation2,
    recommendation2,
    hasTwoRecommendations: Boolean(recommendation2),
    tradeOffs,
    noAlternativeReasonEn: !recommendation2 
      ? `Only ${recommendation1.mandiName} is feasible for this batch. All other candidate mandis exceeded the perishable window (${batch.targetWindowHours || 12}h) or vehicle limits.`
      : null,
    noAlternativeReasonHi: !recommendation2 
      ? `इस लॉट के लिए केवल ${recommendation1.mandiHindiName} ही व्यावहारिक है। अन्य मंडियां सुरक्षित ताज़गी विंडो (${batch.targetWindowHours || 12} घंटे) से बाहर हैं।`
      : null,
    rejected,
    all: sorted,
    batch,
    vehicle,
    whyRecommended
  };
}
