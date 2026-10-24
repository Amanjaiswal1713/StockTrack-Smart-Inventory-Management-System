export const getRevenue = (
 sales
) => {

 return sales.reduce(

 (acc,sale)=>

 acc + sale.revenue,

 0

 );

};