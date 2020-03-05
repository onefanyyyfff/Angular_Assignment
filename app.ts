import { Component, NgModule, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Input, Output} from '@angular/core';
// import { EventEmitter } from '@angular/core'

class Product {
	constructor(
		public sku: string,
		public name: string,
		public imageUrl: string,
		public department: string[],
		public price: number) {
	}
}

@Component({
	selector: 'inventory-app',
	template: `
		<div class="inventory-app">
			<product-list
				[productList]="products"
				(onProductSelected)="productWasSelected($event)">
			</product-list>
		</div>
	`
})
class InventoryApp {
	products: Product[];

	constructor() {
		this.products = [
			new Product(
				'MYSHOES',
				'Black Running Shoes',
				'/resources/images/products/black-shoes.jpg',
				['Men', 'Shoes', 'Running Shoes'],
				109.99),
			new Product(
				'NEATOJACKET',
				'Blue Jacket',
				'/resources/images/products/blue-jacket.jpg',
				['Women', 'Apparel', 'Jackets & Vests'],
				238.99),
			new Product(
				'NICEHAT',
				'A Nice Black Hat',
				'/resources/images/products/black-hat.jpg',
				['Men', 'Accessories', 'Hats'],
				29.99)
		];
	}

	productWasSelected(product: Product): void {
		console.log('Product clicked: ', product);
	}
}

@Component({
	selector: 'product-list',
	inputs: ['productList'],
	outputs: ['onProductSelected'],
	template: `
		<div class="ui items">
			<product-row
				*ngFor="let myProduct of productList"
				[product]="myProduct"
				(click)='clicked(myProduct)'
				[class.selected]="isSelected(myProduct)">
			</product-row>
		</div>	
	`
})
class ProductList {
	productList: Product[];
	onProductSelected: EventEmitter<Product>;
	currentProduct: Product;
	
	constructor() {
		this.onProductSelected = new EventEmitter();
	}

	clicked(product: Product): void {
		this.currentProduct = product;
		this.onProductSelected.emit(product);
	}

	isSelected(product: Product): boolean {
		if (!product || !this.currentProduct) {
			return false;
		}
		return product.sku === this.currentProduct.sku;
	}
}


@Component({
	selector: 'product-row',
	inputs: ['product'],
	host: {'class': 'item'},
	template: `
		<product-image [product]="product"></product-image>
		<div class="content">
			<div class="header">{{ product.name }}</div>
			<div class="meta">
				<div class="product-sku">SKU #{{ product.sku }}</div>
			</div>
			<div class="description">
				<product-department [product]="product"></product-department>
			</div>
		</div>
		<price-display [price]="product.price"></price-display>
		<button (click)='clicked(myProduct)'>click</button>
		<div *ngIf="isShow" (buttonClick)='isShowChange()'>
			<image-modal [product]="product"></image-modal>
		</div>
	`
})
class ProductRow {
	product: Product;
	isShow: Boolean;
	constructor() {
		this.isShow = false;
	}
	clicked(product: Product): void {
		this.isShow = true;
	}
	isShowChange() {
		this.isShow = false;
		location.reload();
	}
}

@Component({
	selector: 'image-modal',
	inputs: ['product'],
	template: `
		<div class="modal">
			<div class="closeIcon" (click)="clicked()">X</div>
			<product-image [product]="product"></product-image>
		</div>	
	`
})

class ImageModal {
	product: Product;
	@Output() buttonClick = new EventEmitter<void>();
	constructor() {
		
	}
	clicked() {
		// this.buttonClick.emit()
		location.reload();
	}
}

@Component({
	selector: 'product-image',
	host: {class: 'ui small image'},
	inputs: ['product'],
	template: `
		<img class="product-image" [src]="product.imageUrl">
	`
})
class ProductImage {
	product: Product;
}


@Component({
	selector: 'price-display',
	inputs: ['price'],
	template: `
		<div class="price-display">\${{ price }}</div>
	`
})
class PriceDisplay {
	price: number;
}


@Component({
	selector: 'product-department',
	inputs: ['product'],
	template: `
		<div class="product-department">
			<span *ngFor="let name of product.department; let i=index">
				<a href="#">{{ name }}</a>
				<span>{{ i < (product.department.length-1) ? '>' : ''}}</span>
	`
})
class ProductDepartment {
	product: Product;
}

@NgModule({
	declarations: [
		InventoryApp,
		ProductImage,
		ProductDepartment,
		PriceDisplay,
		ProductRow,
		ProductList,
		ImageModal
	],
	imports: [ BrowserModule ],
	bootstrap: [ InventoryApp ]
})
class InventoryAppModule {}

platformBrowserDynamic().bootstrapModule(InventoryAppModule);