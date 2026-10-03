export type Bank = {
  id: string;
  name: string;
  /** Short code — fallback if the logo asset is unavailable. */
  short: string;
  /** Tailwind gradient used as the fallback tile. */
  gradient: string;
  /** Official website, used to source the brand logo. */
  domain: string | null;
  /** Locally bundled real logo (downloaded at build time). */
  logo: string | null;
};

export const BANKS: Bank[] = [
  { id: "hdfc", name: "HDFC Bank", short: "HD", gradient: "from-[#004c8f] to-[#ed232a]", domain: "hdfcbank.com", logo: "/logos/hdfc.png" },
  { id: "icici", name: "ICICI Bank", short: "IC", gradient: "from-[#f58220] to-[#ae1c28]", domain: "icicibank.com", logo: "/logos/icici.png" },
  { id: "sbi", name: "State Bank of India", short: "SBI", gradient: "from-[#22409a] to-[#2d6cdf]", domain: "sbi.co.in", logo: "/logos/sbi.png" },
  { id: "axis", name: "Axis Bank", short: "AX", gradient: "from-[#97144d] to-[#e01a4f]", domain: "axisbank.com", logo: "/logos/axis.png" },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "KM", gradient: "from-[#ed1c24] to-[#003874]", domain: "kotak.com", logo: "/logos/kotak.png" },
  { id: "pnb", name: "Punjab National Bank", short: "PNB", gradient: "from-[#4b2e83] to-[#f6a21e]", domain: "pnbindia.in", logo: "/logos/pnb.png" },
  { id: "bob", name: "Bank of Baroda", short: "BoB", gradient: "from-[#f05a28] to-[#e4002b]", domain: "bankofbaroda.in", logo: "/logos/bob.png" },
  { id: "canara", name: "Canara Bank", short: "CN", gradient: "from-[#00539f] to-[#f9b000]", domain: "canarabank.com", logo: "/logos/canara.png" },
  { id: "union", name: "Union Bank of India", short: "UB", gradient: "from-[#c8102e] to-[#00539f]", domain: "unionbankofindia.co.in", logo: "/logos/union.png" },
  { id: "idfc", name: "IDFC FIRST Bank", short: "ID", gradient: "from-[#9c1d26] to-[#ed1c24]", domain: "idfcfirstbank.com", logo: "/logos/idfc.png" },
  { id: "indusind", name: "IndusInd Bank", short: "IN", gradient: "from-[#8b1a3b] to-[#d2232a]", domain: "indusind.com", logo: "/logos/indusind.png" },
  { id: "yes", name: "YES Bank", short: "YES", gradient: "from-[#00518f] to-[#0094d9]", domain: "yesbank.in", logo: "/logos/yes.png" },
  { id: "federal", name: "Federal Bank", short: "FD", gradient: "from-[#f7a81b] to-[#00539f]", domain: "federalbank.co.in", logo: "/logos/federal.png" },
  { id: "rbl", name: "RBL Bank", short: "RBL", gradient: "from-[#8f1838] to-[#d6001c]", domain: "rblbank.com", logo: "/logos/rbl.png" },
  { id: "au", name: "AU Small Finance Bank", short: "AU", gradient: "from-[#5c2d91] to-[#f58220]", domain: "aubank.in", logo: "/logos/au.png" },
  { id: "bandhan", name: "Bandhan Bank", short: "BN", gradient: "from-[#b4121b] to-[#f26522]", domain: "bandhanbank.com", logo: "/logos/bandhan.png" },
  { id: "idbi", name: "IDBI Bank", short: "IB", gradient: "from-[#006b3f] to-[#00954c]", domain: "idbibank.in", logo: "/logos/idbi.png" },
  { id: "indian", name: "Indian Bank", short: "INB", gradient: "from-[#1c3f94] to-[#3f72c0]", domain: "indianbank.in", logo: "/logos/indian.png" },
  { id: "central", name: "Central Bank of India", short: "CB", gradient: "from-[#7b1f2b] to-[#c0392b]", domain: "centralbankofindia.co.in", logo: "/logos/central.png" },
  { id: "boi", name: "Bank of India", short: "BOI", gradient: "from-[#f58220] to-[#1c3f94]", domain: "bankofindia.co.in", logo: "/logos/boi.png" },
  { id: "paytm", name: "Paytm Payments Bank", short: "PY", gradient: "from-[#00baf2] to-[#002970]", domain: "paytmbank.com", logo: "/logos/paytm.png" },
  { id: "airtel", name: "Airtel Payments Bank", short: "AP", gradient: "from-[#e40000] to-[#ff5a5a]", domain: "airtel.in", logo: "/logos/airtel.svg" },
  { id: "cash", name: "Cash / Other", short: "₹", gradient: "from-[#48484f] to-[#8e8e96]", domain: null, logo: null },
];

export function bankById(id: string | null | undefined): Bank | null {
  if (!id) return null;
  return BANKS.find((bank) => bank.id === id) ?? null;
}

export function isValidBankId(id: string): boolean {
  return BANKS.some((bank) => bank.id === id);
}
