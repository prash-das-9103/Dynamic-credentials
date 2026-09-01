/**
 * Development-only data integrity validator.
 * Run: npx ts-node -e "require('./lib/validate-data').validateData()"
 * Never imported in any page or component — zero bundle impact.
 */

import { CREDENTIALS } from "@/data/credentials";
import { EXPERTS } from "@/data/experts";
import { PARTNERS } from "@/data/partners";
import { PUBLICATIONS } from "@/data/publications";
import {
  PRODUCTS,
  INDUSTRIES,
  REGIONS,
  CAPABILITIES,
  CLIENT_NEEDS,
} from "@/data/solutions";

export function validateData(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const productIds = new Set(PRODUCTS.map((p) => p.id));
  const industryIds = new Set(INDUSTRIES.map((i) => i.id));
  const regionIds = new Set(REGIONS.map((r) => r.id));
  const capabilityIds = new Set(CAPABILITIES.map((c) => c.id));
  const clientNeedIds = new Set(CLIENT_NEEDS.map((c) => c.id));
  const expertIds = new Set(EXPERTS.map((e) => e.id));
  const partnerIds = new Set(PARTNERS.map((p) => p.id));
  const publicationIds = new Set(PUBLICATIONS.map((p) => p.id));
  const credentialIds = new Set(CREDENTIALS.map((c) => c.id));

  // Unique IDs
  const credIdArr = CREDENTIALS.map((c) => c.id);
  const duplicateCredIds = credIdArr.filter((id, i) => credIdArr.indexOf(id) !== i);
  if (duplicateCredIds.length > 0) errors.push(`Duplicate credential IDs: ${duplicateCredIds.join(", ")}`);

  const expertIdArr = EXPERTS.map((e) => e.id);
  const duplicateExpertIds = expertIdArr.filter((id, i) => expertIdArr.indexOf(id) !== i);
  if (duplicateExpertIds.length > 0) errors.push(`Duplicate expert IDs: ${duplicateExpertIds.join(", ")}`);

  const partnerIdArr = PARTNERS.map((p) => p.id);
  const duplicatePartnerIds = partnerIdArr.filter((id, i) => partnerIdArr.indexOf(id) !== i);
  if (duplicatePartnerIds.length > 0) errors.push(`Duplicate partner IDs: ${duplicatePartnerIds.join(", ")}`);

  const pubIdArr = PUBLICATIONS.map((p) => p.id);
  const duplicatePubIds = pubIdArr.filter((id, i) => pubIdArr.indexOf(id) !== i);
  if (duplicatePubIds.length > 0) errors.push(`Duplicate publication IDs: ${duplicatePubIds.join(", ")}`);

  // Validate credential references
  for (const cred of CREDENTIALS) {
    cred.productIds.forEach((id) => {
      if (!productIds.has(id)) errors.push(`Credential ${cred.id}: unknown product "${id}"`);
    });
    cred.industryIds.forEach((id) => {
      if (!industryIds.has(id)) errors.push(`Credential ${cred.id}: unknown industry "${id}"`);
    });
    cred.regionIds.forEach((id) => {
      if (!regionIds.has(id)) errors.push(`Credential ${cred.id}: unknown region "${id}"`);
    });
    cred.capabilityIds.forEach((id) => {
      if (!capabilityIds.has(id)) errors.push(`Credential ${cred.id}: unknown capability "${id}"`);
    });
    cred.clientNeedIds.forEach((id) => {
      if (!clientNeedIds.has(id)) errors.push(`Credential ${cred.id}: unknown clientNeed "${id}"`);
    });
    cred.expertIds.forEach((id) => {
      if (!expertIds.has(id)) errors.push(`Credential ${cred.id}: unknown expert "${id}"`);
    });
    cred.partnerIds.forEach((id) => {
      if (!partnerIds.has(id)) errors.push(`Credential ${cred.id}: unknown partner "${id}"`);
    });
  }

  // Validate expert references
  for (const expert of EXPERTS) {
    expert.productIds.forEach((id) => {
      if (!productIds.has(id)) errors.push(`Expert ${expert.id}: unknown product "${id}"`);
    });
    expert.industryIds.forEach((id) => {
      if (!industryIds.has(id)) errors.push(`Expert ${expert.id}: unknown industry "${id}"`);
    });
    expert.regionIds.forEach((id) => {
      if (!regionIds.has(id)) errors.push(`Expert ${expert.id}: unknown region "${id}"`);
    });
    expert.credentialIds.forEach((id) => {
      if (!credentialIds.has(id))
        warnings.push(`Expert ${expert.id}: credentialId "${id}" not in CREDENTIALS`);
    });
  }

  // Validate partner references
  for (const partner of PARTNERS) {
    partner.productIds.forEach((id) => {
      if (!productIds.has(id)) errors.push(`Partner ${partner.id}: unknown product "${id}"`);
    });
    partner.credentialIds.forEach((id) => {
      if (!credentialIds.has(id))
        warnings.push(`Partner ${partner.id}: credentialId "${id}" not in CREDENTIALS`);
    });
    partner.publicationIds.forEach((id) => {
      if (!publicationIds.has(id))
        warnings.push(`Partner ${partner.id}: publicationId "${id}" not in PUBLICATIONS`);
    });
  }

  // Validate publication references
  for (const pub of PUBLICATIONS) {
    pub.productIds.forEach((id) => {
      if (!productIds.has(id)) errors.push(`Publication ${pub.id}: unknown product "${id}"`);
    });
    pub.industryIds.forEach((id) => {
      if (!industryIds.has(id)) errors.push(`Publication ${pub.id}: unknown industry "${id}"`);
    });
    pub.partnerIds.forEach((id) => {
      if (!partnerIds.has(id))
        warnings.push(`Publication ${pub.id}: partnerIds "${id}" not in PARTNERS`);
    });
    pub.credentialIds.forEach((id) => {
      if (!credentialIds.has(id))
        warnings.push(`Publication ${pub.id}: credentialId "${id}" not in CREDENTIALS`);
    });
  }

  return { errors, warnings };
}
