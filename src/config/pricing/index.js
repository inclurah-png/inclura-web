import creator from "./creator";
import group from "./group";
import organization from "./organization";
import ngo from "./ngo";
import institution from "./institution";
import religious from "./religious";
import healthcare from "./healthcare";
import museum from "./museum";
import tourism from "./tourism";
import entertainment from "./entertainment";
import media from "./media";
import accessibility from "./accessibility";

import addons from "./addons";
import advertising from "./advertising";
import transactionFees from "./transactionFees";
import partnerships from "./partnerships";

export const VERIFICATION_PLANS = {
  creator,
  group,
  organization,
  ngo,
  institution,
  religious,
  healthcare,
  museum,
  tourism,
  entertainment,
  media,
  accessibility,
};

export {
  addons,
  advertising,
  transactionFees,
  partnerships,
};

export default VERIFICATION_PLANS;
