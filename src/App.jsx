
import { useEffect } from 'react';
import $ from 'jquery';
window.$ = $;
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  useEffect(() => {
    // Storage Controller
    const StorageController = (function () {
      return {
        storeProduct: function (product) {
          let products;
          if (localStorage.getItem('products') === null) {
            products = [];
            products.push(product);
          } else {
            products = JSON.parse(localStorage.getItem('products'));
            products.push(product);
          }
          localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function () {
          let products;
          if (localStorage.getItem('products') == null) {
            products = [];
          } else {
            products = JSON.parse(localStorage.getItem('products'));
          }
          return products;
        },
        updateProduct: function (product) {
          let products = JSON.parse(localStorage.getItem('products'));

          products.forEach(function (prd, index) {
            if (product.id == prd.id) {
              products.splice(index, 1, product);
            }
          });
          localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function (id) {
          let products = JSON.parse(localStorage.getItem('products'));

          products.forEach(function (prd, index) {
            if (id == prd.id) {
              products.splice(index, 1);
            }
          });
          localStorage.setItem('products', JSON.stringify(products));
        }
      }

    })();

    // Product Controller
    const ProductController = (function () {
      const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
      }

      const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
      }

      // public
      return {
        getProducts: function () {
          return data.products;
        },
        getData: function () {
          return data;
        },
        getProductById: function (id) {
          let product = null;

          data.products.forEach(function (prd) {
            if (prd.id == id) {
              product = prd;
            }
          })
          return product;
        },
        setCurrentProduct: function (product) {
          data.selectedProduct = product;
        },
        getCurrentProduct: function () {
          return data.selectedProduct;
        },
        addProduct: function (name, price) {
          let id;

          if (data.products.length > 0) {
            id = data.products[data.products.length - 1].id + 1;
          } else {
            id = 0;
          }

          const newProduct = new Product(id, name, parseFloat(price));
          data.products.push(newProduct);
          return newProduct;
        },
        updateProduct: function (name, price) {
          let product = null;

          data.products.forEach(function (prd) {
            if (prd.id == data.selectedProduct.id) {
              prd.name = name;
              prd.price = parseFloat(price);
              product = prd;
            }
          });

          return product;
        },
        deleteProduct: function (product) {

          data.products.forEach(function (prd, index) {
            if (prd.id == product.id) {
              data.products.splice(index, 1);
            }
          })

        },
        getTotal: function () {
          let total = 0;

          data.products.forEach(function (item) {
            total += item.price;
          });

          data.totalPrice = total;
          return data.totalPrice;
        }
      }

    })();


    // UI Controller
    const UIController = (function () {

      const Selectors = {
        addForm: "#addFrom",
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
      }

      return {
        exchangeDolar: function () {
          // Use api or static 
          let exchange_dolar = document.getElementById('exchangeDolar').value;
          return exchange_dolar;
        },
        createProductList: function (products) {
          let html = '';
          products.forEach(prd => {
            html += `
                <tr>
                   <td>${prd.id}</td>
                   <td>${prd.name}</td>
                   <td>${prd.price} $</td>
                   <td class="text-right">                       
                      <i class="far fa-edit edit-product btn btn-primary"></i>
                  </td>
                </tr>   
              `;
          });
          document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
          return Selectors;
        },
        addProduct: function (prd) {

          document.querySelector(Selectors.productCard).style.display = 'block';
          var item = `            
              <tr>
              <td>${prd.id}</td>
              <td>${prd.name}</td>
              <td>${prd.price} $</td>
              <td class="text-right">
                 <i class="far fa-edit edit-product btn btn-primary"></i> 
              </td>
          </tr>              
          `;

          document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function (prd) {
          let updatedItem = null;
          let items = document.querySelectorAll(Selectors.productListItems);
          items.forEach(function (item) {
            if (item.classList.contains('bg-warning')) {
              item.children[1].textContent = prd.name;
              item.children[2].textContent = prd.price + ' $';
              updatedItem = item;
            }
          });

          return updatedItem;
        },
        clearInputs: function () {
          document.querySelector(Selectors.productName).value = '';
          document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
          const items = document.querySelectorAll(Selectors.productListItems);
          items.forEach(function (item) {
            if (item.classList.contains('bg-warning')) {
              item.classList.remove('bg-warning');
            }
          });
        },
        hideCard: function () {
          document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
          document.querySelector(Selectors.totalDolar).textContent = total;
          document.querySelector(Selectors.totalTL).textContent = total * this.exchangeDolar();
        },
        addProductToForm: function () {
          const selectedProduct = ProductController.getCurrentProduct();
          document.querySelector(Selectors.productName).value = selectedProduct.name;
          document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        deleteProduct: function () {
          let items = document.querySelectorAll(Selectors.productListItems);
          items.forEach(function (item) {
            if (item.classList.contains('bg-warning')) {
              item.remove();
            }
          });
        },
        addingState: function (item) {
          UIController.clearWarnings();
          UIController.clearInputs();
          document.querySelector(Selectors.addButton).style.display = 'inline';
          document.querySelector(Selectors.updateButton).style.display = 'none';
          document.querySelector(Selectors.deleteButton).style.display = 'none';
          document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {
          tr.classList.add('bg-warning');
          document.querySelector(Selectors.addButton).style.display = 'none';
          document.querySelector(Selectors.updateButton).style.display = 'inline';
          document.querySelector(Selectors.deleteButton).style.display = 'inline';
          document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
      }
    })();


    // App Controller
    const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
      const UISelectors = UICtrl.getSelectors();

      // Load Event Listeners
      const loadEventListeners = function () {

        // add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        // delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);

      }

      const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
          // Add product
          const newProduct = ProductCtrl.addProduct(productName, productPrice);

          // add item to list
          UICtrl.addProduct(newProduct);

          // add product to LS
          StorageCtrl.storeProduct(newProduct);

          // get total
          const total = ProductCtrl.getTotal();

          // show total
          UICtrl.showTotal(total);

          // clear inputs
          UICtrl.clearInputs();
        } else {
          UIController.addForm.submit();
        }

        e.preventDefault();
      }

      const productEditClick = function (e) {

        if (e.target.classList.contains('edit-product')) {

          const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

          // get selected product
          const product = ProductCtrl.getProductById(id);

          // set current product
          ProductCtrl.setCurrentProduct(product);

          UICtrl.clearWarnings();

          // add product to UI
          UICtrl.addProductToForm();

          UICtrl.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
      }

      const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

          // update product
          const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

          // update ui
          let item = UICtrl.updateProduct(updatedProduct);

          // get total
          const total = ProductCtrl.getTotal();

          // show total
          UICtrl.showTotal(total);

          // update storage
          StorageCtrl.updateProduct(updatedProduct);

          UICtrl.addingState();

        }

        e.preventDefault();
      }

      const cancelUpdate = function (e) {

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
      }

      const deleteProductSubmit = function (e) {

        // get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        // delete product
        ProductCtrl.deleteProduct(selectedProduct);

        // delete ui
        UICtrl.deleteProduct();

        // get total
        const total = ProductCtrl.getTotal();

        // show total
        UICtrl.showTotal(total);

        // delete from storage
        StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();

        if (total == 0) {
          UICtrl.hideCard();
        }

        e.preventDefault();
      }

      return {
        init: function () {
          UICtrl.addingState();

          const products = ProductCtrl.getProducts();

          if (products.length == 0) {
            UICtrl.hideCard();
          } else {
            UICtrl.createProductList(products);
          }

          const total = ProductCtrl.getTotal();

          UICtrl.showTotal(total);

          loadEventListeners();
        }
      }

    })(ProductController, UIController, StorageController);

    App.init();


  });
  return (
    <>
      <nav className="navbar navbar-dark bg-success">
        <div className="container justify-content-md-center">
          <a href="javascript:;" className="navbar-brand col-6">
            <i className="fa-solid fa-calculator"></i>&nbsp;&nbsp; Ürün Hesaplayıcı
          </a>
        </div>
      </nav>

      <div className="container mt-3">
        <div className="row justify-content-md-center">
          <div className="col-md-6 col-sm-12">
            <div className="card mb-3">
              <div className="card-body">
                <div className="form-group mb-0">
                  <label for="exchangeDolar">Döviz Dolar Kuru</label>
                  <input type="number" className="form-control" id="exchangeDolar" placeholder="Dolar kurunu giriniz Örn: 18.2" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <form id="addForm">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input type="text" className="form-control" id="productName" placeholder="Ürün Adı" required />
                    </div>
                    <div className="form-group col-md-6">
                      <input type="number" className="form-control" id="productPrice" placeholder="Ürün Fiyatı ($)" required />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm addBtn">
                    <i className="fas fa-plus"></i>&nbsp;&nbsp;
                    Ürün Ekle
                  </button>
                  <button type="submit" className="btn btn-warning btn-sm updateBtn">
                    <i className="far fa-edit"></i>&nbsp;&nbsp;
                    Kaydet
                  </button>&nbsp;&nbsp;
                  <button type="submit" className="btn btn-danger btn-sm deleteBtn">
                    <i className="fas fa-times"></i>&nbsp;&nbsp;
                    Sil
                  </button>&nbsp;&nbsp;
                  <button type="submit" className="btn btn-secondary btn-sm cancelBtn">
                    <i className="fas fa-arrow-circle-left"></i>&nbsp;&nbsp;
                    İptal
                  </button>
                </form>
              </div>
            </div>

            <div id="productCard" className="card mt-3">
              <table className="table table-striped mb-0">
                <thead>
                  <th>ID</th>
                  <th>Ürün Adı</th>
                  <th>Fiyat</th>
                  <th></th>
                </thead>
                <tbody id="item-list">
                </tbody>
              </table>
            </div>

            <div className="card mt-3">
              <div className="card-footer">
                <table className="table mb-0 table-striped">
                  <tr>
                    <td>
                      <strong>Toplam ($)</strong>
                    </td>
                    <td className="text-right">
                      <span id="total-dolar"></span> $
                    </td>
                  </tr>
                  <tr>
                    <td >
                      <strong>Toplam (TL)</strong>
                    </td>
                    <td className="text-right">
                      <span id="total-tl"></span> TL
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
