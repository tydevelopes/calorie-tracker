// Modular design pattern using IIFE (Immediately Invoked Function Expression)
// Storage Controller
const StorageCtrl = (() => {
  // Public methods
  return {
    storeItem: item => {
      // Note:- local storage only stores string so we have to convert unstring using JSON.stringify
      let items = [];
      const storedItems = localStorage.getItem('items');
      // Check if any items in LS
      if (!storedItems) { // If no items stored
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else { // If items stored
        // Get stored items
        items = JSON.parse(storedItems);
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      const storedItems = localStorage.getItem('items');
      // Check if any items in LS
      if (!storedItems) { // If no items stored
        items = [];
      } else { // If items stored
        // Get stored items
        items = JSON.parse(storedItems);
      }
      return items;
    },
    updateItemStorage: updatedItem => {
      let items = JSON.parse(localStorage.getItem('items'));

      /* Long version
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
      */

      // Cleaner version
      const newUpdate = items.map(item => {
        if (item.id === updatedItem.id) {
          item = updatedItem;
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(newUpdate));
    },
    deleteItemFromStorage: id => {
      let items = JSON.parse(localStorage.getItem('items'));

      const itemsAfterDelete = items.filter(item => item.id !== id);

      localStorage.setItem('items', JSON.stringify(itemsAfterDelete));
    },
    clearItemsFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (() => {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data structure / state
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      // Create ID
      let id = null;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(id, name, calories);

      // Ad to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: id => {
      // Loop through items and get matching id
      /* Alternative
      let found = null;
      data.items.forEach( item => {
        if(item.id === id) {
          found = item;
        }
      });
      */
      // Using array destructuring and filter
      const [found] = data.items.filter(item => item.id === id);
      return found;
    },
    updateItem: (name, calories) => {
      const [found] = data.items.filter(item => item.id === data.currentItem.id);
      found.name = name;
      found.calories = parseInt(calories);

      return found;
    },
    deleteItem: id => {
      // Get ids
      const ids = data.items.map(item => item.id);
      // Get index
      const index = ids.indexOf(id);
      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      // Loop through items and add cals
      const totalCalories = data.items.reduce((prev, curr) => prev + curr.calories, 0);

      // Set total cal in data structure
      data.totalCalories = totalCalories;

      return data.totalCalories;
    },
    loadData: () => {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  
  // Public methods
  return {
    populateItemList: items => {
      let html = '';
      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>
        `
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: item => {
      // Show the list
      UICtrl.showList();
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;
      // Insert item 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: item => {
      document.querySelector(`#item-${item.id}`).innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
    },
    deleteListItem: id => {
      document.querySelector(`#item-${id}`).remove();
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: () => {
      document.querySelector(UISelectors.itemList).innerHTML = '';
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    showTotalCalories: totalCalories => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: () => {
      return UISelectors;
    }
  }
})();

// App Controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
  // Load event listeners
  const loadEventListeners = () => {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();
    // Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) { // e.which is used for older browsers
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event. Note:- since the list is added by javascript, it cannot be targed directly and that's why event delegation is used.
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', e => {
      UICtrl.clearEditState();
      e.preventDefault();
    });

    // Clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }


  // Add item submit
  const itemAddSubmit = e => {
    // Get form input from UI COntroller
    const input = UICtrl.getItemInput();
    
    // Check for name and calorie input
    if (input.name && input.calories) {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = e => {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1 ...)
      const listId = e.target.parentElement.parentElement.id;
      
      // Break into an array
      const listArr = listId.split('-');   
      
      // Get the actual id
      const id = parseInt(listArr[1]);

      // Get item 
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
      
    }
   
    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = e => {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
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

  // Delete button event
  const itemDeleteSubmit = (e) => {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  const clearAllItemsClick = () => {
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

    // Hide Ul
    UICtrl.hideList();

  }

  // Public methods
  return {
    // All the stuff that needs to load on app start
    init: () => {
      // Clear edit state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();