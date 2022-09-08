import { PRICING_API_URL } from '../../config/pricing';
import { call } from '../../utils/network';
import { OraclePricingResponseUnitInterface } from './models';

const massagePricing = (
  prices: OraclePricingResponseUnitInterface
): Record<
  string,
  {
    close: number;
  }
> => {
  return prices?.data?.reduce((itr, e) => {
    const symbol = e?.symbol;

    if (itr[symbol]) {
      return itr;
    }
    itr[symbol] = {
      close: parseFloat(e?.price) / 1.0e18
    };
    return itr;
  }, {});
};

export const getPricingFromOracleService = async (): Promise<
  Record<
    string,
    {
      close: number;
    }
  >
> => {
  const pricingResp = await call({ url: PRICING_API_URL });
  return massagePricing(pricingResp);
};
