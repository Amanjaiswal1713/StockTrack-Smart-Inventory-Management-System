export const topSellingProducts = (
 sales,
 products
) => {

 return products.map(product => {

 const totalSold =
 sales

 .filter(
 item =>
 item.productId ===
 product.id
 )

 .reduce(
 (acc,item)=>
 acc +
 item.quantity,
 0
 );

 return {

 ...product,

 sold:
 totalSold

 };

 });

};