export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    const displayCategory = this.category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    document.querySelector('.title').textContent = `Top Products: ${displayCategory}`;
  }

  renderList(list) {
    this.listElement.innerHTML = list.map(this.productCardTemplate).join('');
  }

  productCardTemplate(product) {
    return `<li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>`;
  }
}
