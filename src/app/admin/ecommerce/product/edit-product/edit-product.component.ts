import { Component, OnInit } from '@angular/core';
import { ProductCategoriesComponent } from '../../product-categories/product-categories.component';
import { ProductCategoryService } from 'src/app/admin/services/product-category.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';
import { ProductsService } from 'src/app/admin/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Variant {
  size: string;
  color: string;
  material: string;
  price: number;
  quantity: any;
}

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
  bannerImageSrc: Promise<string | null> | null = null;
  thumbnailImageSrc: Promise<string | null> | null = null;
  sizeChartImageSrc: string | null = null;
  type = 'Add';
  colors: any[] = [];
  newColor: any = '';
  sizes: any[] = [];
  productId!: string;
  newSize: string = '';

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
      costPerItem: [''],
      sale: [false, Validators.required],
      profit: [{ value: '', disabled: true }],
      margin: [{ value: '', disabled: true }],
      stockStatus: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
      productImage: [],
    });

    this.variantForm = this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      material: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    this.variantsForm = this.fb.group({
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        this.fetchProductList();
      }
    });
    this.getCategory();
    this.getManufacturers();
  }

  calculateProfit() {
    const price = this.productForm.get('price')?.value;
    const costPerItem = this.productForm.get('costPerItem')?.value;
    const profit = price - costPerItem;
    this.productForm.patchValue({ profit: profit });
  }

  calculateMargin() {
    const price = this.productForm.get('price')?.value;
    const costPerItem = this.productForm.get('costPerItem')?.value;
    const margin = price > 0 ? ((price - costPerItem) / price) * 100 : 0;
    this.productForm.patchValue({
      margin: margin >= 0 ? margin.toFixed(2) : 0,
    });
  }

  variantForm!: FormGroup;
  variants: Variant[] = [];

  addVariant(): void {
    if (this.variantForm.valid) {
      const { size, color, material, price } = this.variantForm.value;

      const colorsArray = this.parseInput(color);
      const sizesArray = this.parseInput(size);
      const materialsArray = this.parseInput(material);
      const priceValue = Number(price);

      if (isNaN(priceValue) || priceValue <= 0) {
        console.error('Invalid price provided.');
        return;
      }

      colorsArray.forEach((c) => {
        sizesArray.forEach((s) => {
          materialsArray.forEach((m) => {
            this.variants.push({
              size: s,
              color: c,
              material: m,
              price: priceValue,
              quantity: 0,
            });
          });
        });
      });

      this.variantForm.reset();
    } else {
      this.variantForm.markAllAsTouched();
    }
  }

  private parseInput(input: any): string[] {
    if (typeof input === 'string') {
      return input
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  }

  removeVariant(index: number): void {
    this.variants.splice(index, 1);
  }
  fetchProductList() {
    this._productService.get(this.productId).subscribe((res: any) => {
      const productData = res.data;

      this.variants = productData.product_variants;

      this.uploadedImages = productData.product_images.map((img: any) => {
        return { image: img.image, id: img.id };
      });

      this.productForm.patchValue({
        productName: productData.product_name,
        category: productData.productCategoryId,
        menufecturer: productData.manufacturerId,
        price: productData.price,
        costPerItem: productData.cost,
        stockStatus: productData.is_stock_available ? true : false,
        stock: productData.stock_quantity,
        description: productData.description,
        sizeChartImage: productData.sizeChart,
        productImage: productData.productImage,
        sale: productData.inSale,
      });
      this.calculateMargin();
      this.calculateProfit();
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
          this.uploadedImages.push({ image: imageSrc });
        };
        reader.readAsDataURL(file);
      });
      const images = this.productForm.get('images')?.value || [];
      this.productForm.patchValue({ images: [...images, files[0]] });
    }
  }
  draggedIndex: number | null = null;

  onDragStart(event: DragEvent, index: number) {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();

    if (this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
      const draggedImage = this.uploadedImages[this.draggedIndex];
      this.uploadedImages[this.draggedIndex] = this.uploadedImages[targetIndex];
      this.uploadedImages[targetIndex] = draggedImage;
      this.route.params.subscribe((params) => {
        if (this.productId) {
          this.reOrder(this.uploadedImages);
        }
      });
    }

    this.draggedIndex = null;
  }

  onDragEnd(event: DragEvent) {
    this.draggedIndex = null;
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

  addColor(): void {
    if (this.newColor.includes(' ')) {
      const color = this.newColor.split(' ');
      this.colors.push(color.join(''));
      this.newColor = '';
    } else if (this.newColor.trim()) {
      this.colors.push(this.newColor.trim());
      this.newColor = '';
    }
  }

  removeColor(color: { name: string }): void {
    this.colors = this.colors.filter((c) => c !== color);
  }

  addSize(): void {
    if (this.newSize.trim()) {
      this.sizes.push(this.newSize.trim());
      this.newSize = '';
    }
  }

  removeSize(size: { name: string }): void {
    this.sizes = this.sizes.filter((c) => c !== size);
  }

  colorsValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const colors = control.value as any[];
    return colors.length > 0 ? null : { required: true };
  }

  handleSizeChartImageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.sizeChartImageSrc = e.target?.result as string;
        this.productForm.patchValue({ sizeChartImage: file });
      };
      reader.readAsDataURL(file);
    }
  }

  imageArr: any = [];
  reOrder(uploadedImages: any) {
    this.imageArr = [];

    for (let images of uploadedImages) {
      const image = images.image.split('v1/');
      if (image.length > 1) {
        this.imageArr.push(image[1]);
      }
    }

    const body = {
      image: this.imageArr,
    };

    this._productService.reOrderImage(body, this.productId).subscribe();
  }
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.createFormData();
      // if (this.productForm.get('images')?.value.length === 0) {
      //   this.productForm.get('images')?.setErrors({ required: true });
      //   this.productForm.markAllAsTouched();
      //   return;
      // }
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

  // updateVariant(index: number, field: keyof Variant, value: string | number) {
  //   if (field === 'price') {
  //     this.variants[index].price =
  //       typeof value === 'string' ? parseFloat(value) : value;
  //   } else {
  //     this.variants[index][field] = value as Variant[typeof field];
  //   }
  // }

  saveData() {
    const formData = this.createFormData();
    const productData: any = {};

    const images = this.uploadedImages.map((img) => img.image);
    images.forEach((image, index) => {
      formData.append('product_image', image);
    });

    formData.forEach((value, key) => {
      if (productData[key]) {
        if (!Array.isArray(productData[key])) {
          productData[key] = [productData[key]];
        }
        productData[key].push(value);
      } else {
        productData[key] = value;
      }
    });

    // Save data to local storage (if needed)
    localStorage.setItem('productData', JSON.stringify(productData));
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
    formData.append('cost', this.productForm.get('costPerItem')?.value);
    formData.append('inSale', this.productForm.get('sale')?.value);
    formData.append(
      'is_stock_available',
      JSON.parse(this.productForm.get('stockStatus')?.value)
    );
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('variants', JSON.stringify(this.variants));

    for (let data of this.productForm.get('images')?.value) {
      formData.append('product_image', data);
    }

    return formData;
  }

  variantsForm: FormGroup;
  variantPrices: { [key: string]: number } = {};
  variantAvailability: { [key: string]: number } = {};
  finalizedOptions: { name: string; values: string[] }[] = [];
  maxVariants = 3;

  get options(): FormArray {
    return this.variantsForm.get('options') as FormArray;
  }

  addOption(): void {
    if (this.options.length < this.maxVariants) {
      const optionGroup = this.fb.group({
        name: ['', Validators.required],
        values: this.fb.array([this.createValueField()]),
      });
      this.options.push(optionGroup);
      this.finalizedOptions.push({ name: '', values: [] });
    }
  }

  createValueField(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required],
    });
  }

  getValues(optionIndex: number): FormArray {
    return this.options.at(optionIndex).get('values') as FormArray;
  }

  addValue(optionIndex: number): void {
    this.getValues(optionIndex).push(this.createValueField());
  }

  removeValue(optionIndex: number, valueIndex: number): void {
    this.getValues(optionIndex).removeAt(valueIndex);
  }

  removeOption(optionIndex: number): void {
    this.options.removeAt(optionIndex);
    this.finalizedOptions.splice(optionIndex, 1);
  }
  structuredVariants: any[] = [];

  finalizeOption(optionIndex: number): void {
    const option = this.options.at(optionIndex);

    if (option.valid && this.getValues(optionIndex).valid) {
      const finalizedOption = {
        name: option.value.name,
        values: this.getValues(optionIndex).controls.map(
          (value) => value.value.value
        ),
      };

      this.finalizedOptions[optionIndex] = finalizedOption;
      this.updateStructuredVariants();
    } else {
      option.markAllAsTouched();
      this.getValues(optionIndex).controls.forEach((value) =>
        value.markAllAsTouched()
      );
    }
  }

  updateStructuredVariants(): void {
    this.structuredVariants = [];

    const combinations = this.generateCombinations(
      this.finalizedOptions.map((option) => option.values)
    );

    combinations.forEach((combination) => {
      const variant: any = {};
      combination.forEach((value, index) => {
        const optionName = this.finalizedOptions[index].name;
        variant[optionName] = value;
      });
      variant.price = this.variantPrices[combination.join(' - ')] || 0;
      variant.quantity = this.variantAvailability[combination.join(' - ')] || 0;
      this.structuredVariants.push(variant);
      console.log(this.structuredVariants);
    });
  }

  updateVariant(variant: any, field: 'price' | 'quantity', value: string) {
    if (field === 'price') {
      variant.price = parseFloat(value); // Update price
    } else if (field === 'quantity') {
      variant.quantity = parseInt(value, 10); // Update quantity
    }

    console.log(this.structuredVariants);
  }

  getOptionEntries(variant: any): { key: string; value: any }[] {
    return Object.entries(variant)
      .map(([key, value]) => ({ key, value }))
      .filter((entry) => entry.key !== 'price' && entry.key !== 'quantity');
  }

  private generateCombinations(
    arrays: string[][],
    prefix: string[] = []
  ): string[][] {
    if (arrays.length === 0) return [prefix];
    const [first, ...rest] = arrays;
    const combinations: string[][] = [];

    for (const value of first) {
      combinations.push(...this.generateCombinations(rest, [...prefix, value]));
    }

    return combinations;
  }
}
