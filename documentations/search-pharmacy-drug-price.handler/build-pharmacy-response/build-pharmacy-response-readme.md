# buildPharmacyResponse

**Endpoint:** searchPharmacyDrugPriceHandler
(search-pharmacy-drug-price.handler.ts)<br />

**On Success:** returns getPharmaciesAndPricesForNdc(...groupPlanCode, ndc,
quantity...)<br />

**getPharmaciesAndPricesForNdc:**<br />

- returns SuccessResponse with `buildPharmacyResponse();`

# buildPharmacyResponse (Details)

<br />

Props:<br />

- pharmacies: IPrescriptionPharmacy[],
- sortBy: string,
- limit: number,
- pharmacyPrices: IDrugPriceNcpdp[],
- coupon?: ICoupon

<br />

Also see [buildPharmacyResponse Coupon Layman Logic](../coupon/coupon-readme.md)

<br />

**buildPharmacyResponse Layman Logic:**

<br />

1. Loop through the `pharmacies` array given in props.

<br />

2. Does the coupon logic conditional evaluate to true? (See logic
   [here](../coupon/coupon-readme.md))<br />

- YES > CONTINUE TO 4.
- NO > CONTINUE TO 2.1.

<br />

2.1. Does showAllPharmacies equal true?

- YES > CONTINUE TO 4.
- NO > (Check Coupon Logic) _This pharmacy will not be included in response if coupon logic does evaluate to true._

<br />

3. Continue to the next pharmacy `pharm` in loop of pharmacies.

<br />

4. Set new `pharmacy` details as IPharmacy from current pharmacy `pharm` values.

<br />

5. Set new `pharmacyDrugPrice` as IPharmacy equal to `{ pharm }`

<br />

6. Set new `pharmacyPrice` to price in `pharmacyPrices` where current `pharm`
   ncpdp matches.

<br />

7. Does `pharmacyPrice` exist?<br />

- YES > Set `pharmacyDrugPrice.price` equal to `pharmacyPrice.price` & CONTINUE
  TO 8.
- NO > CONTINUE TO 8.

<br />

8. Is `pharmacyIsFeatured` or `pharmacyIsInCouponNetwork` true? (See logic [here](../coupon/coupon-readme.md))<br />

- YES > Set `pharmacyDrugPrice.price` equal to `couponInfo` & CONTINUE TO 9.
- NO > CONTINUE TO 9.

<br />

NOTE: If `showAllPharmacies` equals true and `pharmacyIsFeatured` and `pharmacyIsInCouponNetwork` is false, the pharmacy will be pushed to list without coupon property declared.

<br />

9. Is `pharmacyDrugPrice.price` defined or is `pharmacyIsFeatured` true?<br />

- YES > Push `pharmacyDrugPrice` to `pharmacyDrugPriceList` & CONTINUE TO 10.
- NO > CONTINUE TO 10. _This pharmacy will not be included in response._

<br />

10. Is the loop done?<br />

- YES > CONTINUE TO 11.
- NO > Go to next `pharm` in loop. (Repeat 1-10)

<br />

11. `pharmacyDrugPriceList` is sorted in respect to the `sortBy` prop

<br />

12. `bestPricePharmacy` is found by filtering lowest price in
    `pharmacyDrugPriceList`

<br />

13. `pharmacyPricesResponse` may be a subset of or equivalent to
    `pharmacyDrugPriceList`

<br />

13. Returned is `bestPricePharmacy` and `pharmacyPricesResponse`

<br />

# buildPharmacyResponse (Extended)

<br />
<br />

**pharmacyDrugPriceList:**<br />

- initialized as an empty array of type IPharmacyDrugPrice
- each appropriate pharmacy and it's properties (including coupon) are pushed to
  this

<br />

**IPharmacy:**<br />

```
{
    address: IAddress;
    isMailOrderOnly: boolean;
    name: string;
    ncpdp: string;
    hours: IHours[];
    phoneNumber?: string;
    twentyFourHours: boolean;
    distance?: number;
}
```
