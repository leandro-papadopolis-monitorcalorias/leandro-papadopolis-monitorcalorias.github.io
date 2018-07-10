// Storage Controller
const StorageCtrl = (function(){
  
  // Public Methods
  return {
    storeItem: function(item) {
      let items;
      // Check if any item in LS
      if(localStorage.getItem('items') === null) {
        items = [];
        
        // Push item
        items.push(item);

        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));

        // Push item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;

    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // { id: 0, name: 'Stake Dinner', calories: 1200 },
    //   // { id: 1, name: 'Cookie', calories: 400 },
    //   // { id: 2, name: 'Eggs', calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, calories) {
      let id;

      // Create id
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      newItem = new Item(id, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      // return total
      return data.totalCalories;
    },

    // Check if any items
    checkIfAny: function (items) {
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
    },

    logData: function () {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '.collection-item',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public Methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `
        <li id="item-${item.id}" class="collection-item">
          <strong>${item.name}: </strong>
          <em>${item.calories} Calorias</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // Create li element
      const li = document.createElement('li');

      // Add class
      li.className = 'collection-item';

      // Add id
      li.id = `item-${item.id}`;

      // Add html
      li.innerHTML = `
      <strong>${item.name}: </strong>
      <em>${item.calories} Calorias</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn nodelist in array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemId = listItem.getAttribute('id');
        
        if(itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${item.name}: </strong>
          <em>${item.calories} Calorias</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click select
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClicked);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }

  // Add item Submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add item to data structure
      newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localstorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit
  const itemEditClicked = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get item list id (item-0, item-1, ...)
      const listId = e.target.parentNode.parentNode.id;

      // Breat into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Set item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Item update submit
  const itemUpdateSubmit = function (e) {
    // Get input
    const input = UICtrl.getItemInput();

    // Updated item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update LS
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Fetch items from data structure
    const items = ItemCtrl.getItems();

    ItemCtrl.checkIfAny(items);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from LS
    StorageCtrl.clearItemsFromStorage();

    // Fetch items from data structure
    const items = ItemCtrl.getItems();

    ItemCtrl.checkIfAny(items);

    e.preventDefault();
  }

  // Public Methods
  return {
    init: function () {
      // Set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      ItemCtrl.checkIfAny(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();