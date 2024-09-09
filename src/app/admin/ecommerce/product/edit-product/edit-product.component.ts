import { Component, OnInit } from '@angular/core';
import { ProductCategoriesComponent } from '../../product-categories/product-categories.component';
import { ProductCategoryService } from 'src/app/admin/services/product-category.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';
import { ProductsService } from 'src/app/admin/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  categories!: any;
  manufacturers!: any;
  productForm!: FormGroup;
  selectedColors: any[] = [];
  bannerImageChangedEvent: any = '';
  showBannerCropper = false;
  croppedBannerImage: any = '';
  bannerImageSrc: Promise<string | null> | null = null;
  thumbnailImageSrc: Promise<string | null> | null = null;

  thumbnailImageChangedEvent: any = '';
  showThumbnailCropper = false;
  croppedThumbnailImage: any = '';

  colors: any[] = [];
  newColor: string = '';
  sizes = [
    { item_id: 1, item_text: 'Extra Small' },
    { item_id: 2, item_text: 'Small' },
    { item_id: 3, item_text: 'Medium' },
    { item_id: 4, item_text: 'Large' },
    { item_id: 5, item_text: 'Extra Large' },
  ];

  selectedSizes: any[] = [];

  dropdownSettings: any;
  productId!: string;

  constructor(
    private _categoryService: ProductCategoryService,
    private fb: FormBuilder,
    private _manufacturerService: ManufacturersService,
    private _productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      menufecturer: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stockStatus: ['', Validators.required],
      colors: [[]],
      size: [[]],
      stock: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      images: [[]],
      productImage: [],
    });
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      unSelectAllText: false,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        this.fetchProductList();
      }
    });
    this.getCategory();
    this.getManufacturers();
  }

  fetchProductList() {
    this._productService.get(this.productId).subscribe((res: any) => {
      const productData = res.data;
      this.colors = productData.product_colors.map((color: any) => color.color);

      this.selectedSizes = productData.product_sizes.map((size: any) => {
        return { item_id: size.size_id, item_text: size.size }; // Assuming size_id is available
      });
      this.uploadedImages = productData.product_images.map((img: any) => {
        return { image: img.image, id: img.id };
      });

      this.productForm.patchValue({
        productName: productData.product_name,
        category: productData.productCategoryId,
        menufecturer: productData.manufacturerId,
        price: productData.price,
        stockStatus: productData.is_stock_available ? 'true' : 'false',
        size: this.selectedSizes,
        stock: productData.stock_quantity,
        description: productData.description,
        productImage: productData.productImage,
      });
    });
  }

  getCategory() {
    this._categoryService.list().subscribe((res) => {
      if (res) {
        this.categories = res;
      }
    });
  }

  getManufacturers() {
    this._manufacturerService.list().subscribe((res: any) => {
      if (res) {
        this.manufacturers = res.data;
      }
    });
  }

  uploadedImages: { id?: number; image: string }[] = [];

  handleImageInput(event: Event, type: 'banner' | 'thumbnail'): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const imageSrc = e.target?.result as string;
          this.uploadedImages.push({ image: imageSrc }); // Add the image to the list
        };
        reader.readAsDataURL(file);
      });
      const images = this.productForm.get('images')?.value || [];
      this.productForm.patchValue({ images: [...images, files[0]] });
    }
  }

  removeImage(index: number, id?: number): void {
    if (id) {
      const productImage = this.uploadedImages.find(
        (data) => data.image == this.productForm.value.productImage
      );
      const data = {
        productImageId: id,
        isMatched: productImage ? true : false,
      };
      this._productService.deleteProductImage(data).subscribe((res) => {});
    }
    this.uploadedImages.splice(index, 1);
    const images = this.productForm.get('images')?.value || [];
    images.splice(index, 1);
    this.productForm.patchValue({ images });
  }

  setImageSrc(elementId: string, src: string): void {
    const imgElement = document.getElementById(elementId) as HTMLImageElement;
    if (imgElement) {
      imgElement.src = src;
    }
  }

  onSizeSelect(item: any) {
    const index = this.selectedSizes.indexOf(item.item_text);
    if (index === -1) {
      this.selectedSizes.push(item.item_text);
    } else {
      this.selectedSizes.splice(index, 1);
    }
  }

  onSizeDeSelect(item: any) {
    const index = this.selectedSizes.findIndex((cat) => cat === item.item_text);
    if (index !== -1) {
      this.selectedSizes.splice(index, 1);
    }
    console.log('Deselected:', this.selectedSizes);
  }

  addColor(): void {
    console.log(this.newColor);
    if (this.newColor.trim()) {
      this.colors.push(this.newColor.trim());
      this.newColor = '';
    }
  }

  removeColor(color: { name: string }): void {
    this.colors = this.colors.filter((c) => c !== color);
  }

  colorsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const colors = control.value as any[];
    return colors.length > 0 ? null : { required: true };
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.createFormData();
      if (this.productForm.get('images')?.value.length === 0) {
        this.productForm.get('images')?.setErrors({ required: true });
        this.productForm.markAllAsTouched();
        return;
      }
      if (this.productId) {
        this._productService
          .update(this.productId, formData)
          .subscribe((res) => {
            if (res) {
              this.router.navigate(['/products']);
            }
          });
      } else {
        this._productService.add(formData).subscribe((res) => {
          if (res) {
            this.router.navigate(['/products']);
          }
        });
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();

    formData.append('product_name', this.productForm.get('productName')?.value);
    formData.append(
      'productCategoryId',
      JSON.parse(this.productForm.get('category')?.value)
    );
    formData.append(
      'manufacturerId',
      JSON.parse(this.productForm.get('menufecturer')?.value)
    );
    formData.append('price', this.productForm.get('price')?.value);
    formData.append(
      'is_stock_available',
      JSON.parse(this.productForm.get('stockStatus')?.value)
    );
    formData.append('stock_quantity', this.productForm.get('stock')?.value);
    formData.append('description', this.productForm.get('description')?.value);

    formData.append('color', JSON.stringify(this.colors));

    formData.append(
      'size',
      JSON.stringify(this.selectedSizes.map((data) => data.item_text))
    );

    for (let data of this.productForm.get('images')?.value) {
      formData.append('product_image', data);
    }

    return formData;
  }
}
