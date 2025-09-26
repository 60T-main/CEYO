import Skeleton from 'react-loading-skeleton';

const CustomProducts = ({
  Product,
  currentProduct,
  customProductsList,
  handleCartUpdate,
  closeAllOverlays,
  API_BASE_URL,
  variant,
  CardSkeleton,
  isLoading,
}) => {
  console.log('loading in CustomProducts', isLoading);

  const cardCount = 12;
  let customProducts = customProductsList.slice(0, cardCount);

  variant === 'recent' &&
    (customProducts = customProducts.filter((product) => product.id !== currentProduct.id));

  return (
    <>
      <section className="new-products-section">
        <div className={variant === 'new' ? 'new-products-parent' : 'recent-products-parent'}>
          <div className={variant === 'new' ? 'new-products-title' : 'recent-products-title'}>
            <h2 className="inline-font">
              {variant === 'new' ? 'ახალი კოლექცია' : variant === 'recent' ? 'ბოლოს ნანახი' : ''}
            </h2>
            {variant === 'new' && (
              <div class="see-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
                <p className="inline-font">ყველას ნახვა</p>
              </div>
            )}
          </div>
          <div className={variant === 'new' ? 'background-red-item' : 'hidden'}></div>
        </div>

        <div
          className={
            variant === 'recent' && CustomProducts
              ? 'new-products'
              : variant === 'new' && CustomProducts
              ? 'new-products'
              : 'hidden'
          }
        >
          {isLoading
            ? [...Array(cardCount)].map((_, i) => <CardSkeleton key={i} variant={'home'} />)
            : customProducts.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  currentProduct={currentProduct}
                  handleCartUpdate={handleCartUpdate}
                  closeAllOverlays={closeAllOverlays}
                  API_BASE_URL={API_BASE_URL}
                  variant="home"
                  isLoading={isLoading}
                />
              ))}
        </div>
      </section>
    </>
  );
};

export default CustomProducts;
