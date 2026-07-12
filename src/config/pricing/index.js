import creator from "./creator";
import group from "./group";
import organization from "./organization";
import ngo from "./ngo";
import institution from "./institution";
import healthcare from "./healthcare";
import media from "./media";
import accessibility from "./accessibility";
import addons from "./addons";
import advertising from "./advertising";
import partnerships from "./partnerships";
import transactionFees from "./transactionFees";

const VERIFICATION_PLANS = {
  creator,
  group,
  organization,
  ngo,
  institution,
  healthcare,
  media,
  accessibility,
};

export {
  creator,
  group,
  organization,
  ngo,
  institution,
  healthcare,
  media,
  accessibility,
  addons,
  advertising,
  partnerships,
  transactionFees,
  VERIFICATION_PLANS,
};

export default VERIFICATION_PLANS;
