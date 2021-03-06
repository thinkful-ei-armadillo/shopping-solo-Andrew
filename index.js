/* global $ */

const STORE = {
	items: [
		{name: 'apples', checked: false},
		{name: 'oranges', checked: false},
		{name: 'milk', checked: true},
		{name: 'bread', checked: false}
	],
	hideChecked: false,
	filter: false,
	editted: false
};

function generateItemElement(item, index) {
	if (item.checked){
		return `
		<li class="js-item-index-element" data-item-index="${index}">
		<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
		<div class="shopping-item-controls">
			<button class="shopping-item-toggle js-item-toggle">
				<span class="button-label">check</span>
			</button>
			<button class="shopping-item-delete js-item-delete">
				<span class="button-label">delete</span>
			</button>
		  </div>
		</li>`;
	}
	else{
		return `
	<li class="js-item-index-element" data-item-index="${index}">
	<form class="js-edit-item">
		<input type="text" class="shopping-item js-shopping-item${item.checked ? 'shopping-item__checked' : ''}" value ="${item.name}" />
	</form>    
	<div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;}
}

function handleEditItemClicked(){
	$('.shopping-list').on('submit', '.js-edit-item', function(event){
		event.preventDefault();
		const editItemName = $(event.currentTarget);
		const editIndex = getItemIndexFromElement(editItemName);
		console.log(editIndex);
		STORE.items[editIndex].name = editItemName.find('.shopping-item').val();
		renderShoppingList();
	});
}
function generateShoppingItemsString(shoppingList) {
	console.log('Generating shopping list element');

	const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
	return items.join('');
}

function renderShoppingList() {
	// render the shopping list in the DOM
	console.log('`renderShoppingList` ran');
	
	if (STORE.filter){
		STORE.filter = !STORE.filter;
		const filterItemName = $('.js-filtered-display-entry').val();
		const filteredArray = filterThroughSTORE(filterItemName);
		const filteredSubmissionString = generateShoppingItemsString(filteredArray);
		$('.js-shopping-list').html(filteredSubmissionString);
	}
	else if (STORE.hideChecked){
		const filteredItems = STORE.items.filter(element =>!element.checked);
		$('.js-shopping-list').html(generateShoppingItemsString(filteredItems));
	}
	else if (STORE.editted){
		console.log('We editting');
	}
	else {
		const shoppingListItemsString = generateShoppingItemsString(STORE.items);
		$('.js-shopping-list').html(shoppingListItemsString);
	}
}

function handleCheckboxClicked(){
	// Event listener for the checkbox
	// We do not want this function doing any rendering of the HTML
	// Thus, we call renderShoppingList and also add conditionals to THAT function
	$('#checkbox_id').click(function(){
		console.log('Checkmark working');
		STORE.hideChecked = !STORE.hideChecked;	
		renderShoppingList();	
	});
}

function handleFilterSubmission(){
	// When submitted, take the text
	// Filter the text through the displayed items
	// Change the render function to change the HTML to only the filtered items
	// Call the render function
	// How do I get it to meet a different condition of the render function?

	$('#js-filtered-list-form').submit(function(event){
		event.preventDefault();
		console.log('Filter button is working');
		STORE.filter = !STORE.filter;
		renderShoppingList();
	});
}

function filterThroughSTORE (filterItem){
	return STORE.items.filter(function(item){
		return item.name === filterItem;
	});
}

function addItemToShoppingList(itemName) {
	console.log(`Adding "${itemName}" to shopping list`);
	STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
	$('#js-shopping-list-form').submit(function(event) {
		event.preventDefault();
		console.log('`handleNewItemSubmit` ran');
		const newItemName = $('.js-shopping-list-entry').val();
		$('.js-shopping-list-entry').val('');
		addItemToShoppingList(newItemName);
		renderShoppingList();
	});
}

function toggleCheckedForListItem(itemIndex) {
	console.log('Toggling checked property for item at index ' + itemIndex);
	STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
	const itemIndexString = $(item)
		.closest('.js-item-index-element')
		.attr('data-item-index');
	return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
	$('.js-shopping-list').on('click', '.js-item-toggle', event => {
		console.log('`handleItemCheckClicked` ran');
		const itemIndex = getItemIndexFromElement(event.currentTarget);
		toggleCheckedForListItem(itemIndex);
		renderShoppingList();
	});
}

function remove(array, index) {
	return array.splice(index, 1);
}

function handleDeleteItemClicked() {
	// this function will be responsible for when users want to delete a shopping list
	// item
	$('.js-shopping-list').on('click', '.js-item-delete', function (event){
		console.log('handleDeleteItemClicked ran');
		remove(STORE.items, getItemIndexFromElement(event.currentTarget));
		renderShoppingList();
	});
	console.log('`handleDeleteItemClicked` ran');
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
	renderShoppingList();
	handleFilterSubmission();
	handleNewItemSubmit();
	handleItemCheckClicked();
	handleDeleteItemClicked();
	handleCheckboxClicked();
	handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);