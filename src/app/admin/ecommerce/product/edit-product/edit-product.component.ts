import { Component, HostListener, OnInit } from '@angular/core';
import { ProductCategoriesComponent } from '../../product-categories/product-categories.component';
import { ProductCategoryService } from 'src/app/admin/services/product-category.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ManufacturersService } from 'src/app/admin/services/manufacturers.service';
import { ProductsService } from 'src/app/admin/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LocationWarehouseService } from 'src/app/admin/services/location-warehouse.service';

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
  locationData: any;
  selectedLocationIds: any = [];

  constructor(
    private _categoryService: ProductCategoryService,
    private fb: FormBuilder,
    private _manufacturerService: ManufacturersService,
    private _productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationWarehouseService
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
      weight: [''],
      location: [[], Validators.required],
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
        this.type = 'Update';
      }

      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        allowSearchFilter: true,
        enableCheckAll: false,
        unSelectAllText: false,
        maxWidth: 300,
        // itemsShowLimit: 3,
        searchPlaceholderText: 'Search Categories!',
        closeDropDownOnSelection: true,
      };
    });

    this.productForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      if (!this.productId) {
        this.updateDraft();
      }
    });
    this.variantsForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      if (!this.productId) {
        this.updateDraft();
      }
    });
    this.getCategory();
    this.getManufacturers();
    this.getLocation();
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

      this.structuredVariants = productData.product_variants.map(
        (variant: any) => ({
          ...variant,
          price: variant.price || 0,
        })
      );
      this.finalizedOptions = productData.productVariant;
      if (this.finalizedOptions) {
        for (let item of this.finalizedOptions) {
          this.finalizedStates.push(true);
          this.addOption();
        }
      }
      this.updateStructuredVariants();

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
        location: productData.product_warehouses,
        weight: productData.weight,
      });

      productData.product_warehouses?.map((item: { id: any }) => {
        this.selectedLocationIds.push(item.id);
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

  getLocation() {
    this.locationService.list().subscribe((res: any) => {
      if (res) {
        this.locationData = res.data;
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
      formData.append('is_draft', '0');
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
      window.scroll(0, 0);
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

    // Check if there are images and store them as an array
    if (images.length > 0) {
      productData.product_image = images.length === 1 ? [images[0]] : images; // Ensure it's always an array
    }

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

    localStorage.setItem('productData', JSON.stringify(productData));
  }

  private createFormData(): FormData {
    const formData = new FormData();

    formData.append('product_name', this.productForm.get('productName')?.value);

    const categoryValue = this.productForm.get('category')?.value;
    formData.append(
      'productCategoryId',
      categoryValue ? JSON.parse(categoryValue) : null
    );

    const manufacturerValue = this.productForm.get('menufecturer')?.value;
    formData.append(
      'manufacturerId',
      manufacturerValue ? JSON.parse(manufacturerValue) : null
    );

    formData.append(
      'warehouseId',
      this.selectedLocationIds?.length > 0
        ? JSON.stringify(this.selectedLocationIds)
        : ''
    );

    const priceValue = this.productForm.get('price')?.value;
    formData.append('price', priceValue ? priceValue : 0);

    const costValue = this.productForm.get('costPerItem')?.value;
    formData.append('cost', costValue ? costValue : 0);

    formData.append('weight', this.productForm.get('weight')?.value);
    formData.append('inSale', this.productForm.get('sale')?.value);

    const stockStatusValue = this.productForm.get('stockStatus')?.value;
    formData.append(
      'is_stock_available',
      stockStatusValue ? JSON.parse(stockStatusValue) : false
    );

    formData.append('description', this.productForm.get('description')?.value);

    const convertedVariants = this.convertVariantsToOptions(
      this.structuredVariants
    );
    formData.append('variants', JSON.stringify(convertedVariants) ?? null);

    formData.append(
      'productVariants',
      JSON.stringify(this.finalizedOptions) ?? null
    );

    const images = this.productForm.get('images')?.value;
    if (Array.isArray(images)) {
      for (let data of images) {
        formData.append('product_image', data);
      }
    }

    return formData;
  }

  private convertVariantsToOptions(variants: any[]): any[] {
    return variants.map((variant) => {
      const converted: any = {};
      Object.entries(variant).forEach(([key, value], index) => {
        if (key !== 'price' && key !== 'quantity') {
          converted[`option${index + 1}`] = value;
        }
      });
      converted.price = variant.price;
      converted.quantity = variant.quantity;
      return converted;
    });
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
    console.log('Call');
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

      console.log('Finalized Option:', finalizedOption); // Log finalized option
      this.finalizedOptions[optionIndex] = finalizedOption;
      this.finalizedStates[optionIndex] = true;

      this.updateStructuredVariants(); // Call to update structured variants
    } else {
      console.error('Invalid option or values!'); // Log if invalid
      option.markAllAsTouched();
      this.getValues(optionIndex).controls.forEach((value) =>
        value.markAllAsTouched()
      );
    }
  }

  updateStructuredVariants(): void {
    console.log('updateStructuredVariants called');
    console.log('Finalized Options:', this.finalizedOptions);

    this.structuredVariants = []; // Clear structured variants

    const validOptions = this.finalizedOptions?.filter(
      (option) => option.name && option.values.length > 0
    );

    const combinations = this.generateCombinations(
      validOptions?.map((option) => option.values)
    );

    if (combinations.length === 0) {
      console.warn('No combinations generated.');
    } else {
      combinations.forEach((combination) => {
        const variant: any = {};
        combination.forEach((value, index) => {
          const optionName = validOptions[index].name;
          variant[optionName] = value;
        });
        variant.price = this.variantPrices[combination.join(' - ')] || 0;
        variant.quantity =
          this.variantAvailability[combination.join(' - ')] || 0;
        this.structuredVariants.push(variant);
      });
    }

    console.log('Structured Variants:', this.structuredVariants);
  }

  updateVariant(variant: any, field: 'price' | 'quantity', value: string) {
    if (field === 'price') {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        variant.price = parsedValue;
      } else {
        variant.price = 0;
      }
    } else if (field === 'quantity') {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        variant.quantity = parsedValue;
      } else {
        variant.quantity = 0;
      }
    }

    // console.log(this.structuredVariants);
  }

  getOptionEntries(variant: any): { key: string; value: any }[] {
    return Object.entries(variant)
      .map(([key, value]) => ({ key, value }))
      .filter(
        (entry) =>
          ![
            'price',
            'quantity',
            'created_at',
            'updated_at',
            'id',
            'productId',
            'deleted_at',
            'is_deleted',
          ].includes(entry.key)
      );
  }

  private generateCombinations(
    arrays: string[][],
    prefix: string[] = []
  ): string[][] {
    if (arrays?.length === 0) return [prefix];
    const [first, ...rest] = arrays;
    const combinations: string[][] = [];

    for (const value of first) {
      const result = this.generateCombinations(rest, [...prefix, value]);
      combinations.push(...result);
    }

    console.log('Generated combinations:', combinations); // Log generated combinations
    return combinations;
  }
  finalizedStates: boolean[] = [];

  reopenOption(optionIndex: number): void {
    if (optionIndex < this.finalizedOptions.length) {
      this.finalizedStates[optionIndex] = false;

      const currentOption = this.finalizedOptions[optionIndex];

      const optionFormGroup = this.options.at(optionIndex);
      optionFormGroup.get('name')?.setValue(currentOption.name);

      const valuesArray = this.getValues(optionIndex);
      valuesArray.clear();

      currentOption.values.forEach((value) => {
        const valueFormGroup = this.createValueField();
        valueFormGroup.get('value')?.setValue(value);
        valuesArray.push(valueFormGroup);
      });
    }
  }

  draggedIndex2: number | null = null;

  onDragStartHandler(event: DragEvent, index: number) {
    this.draggedIndex2 = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragOverHandler(event: DragEvent) {
    event.preventDefault();
  }

  onDropHandler(event: DragEvent, targetIndex: number) {
    event.preventDefault();

    if (this.draggedIndex2 !== null && this.draggedIndex2 !== targetIndex) {
      const draggedOption = this.finalizedOptions[this.draggedIndex2];
      const draggedState = this.finalizedStates[this.draggedIndex2];

      this.finalizedOptions[this.draggedIndex2] =
        this.finalizedOptions[targetIndex];
      this.finalizedStates[this.draggedIndex2] =
        this.finalizedStates[targetIndex];

      this.finalizedOptions[targetIndex] = draggedOption;
      this.finalizedStates[targetIndex] = draggedState;

      this.updateStructuredVariants();
    }

    this.draggedIndex2 = null;
  }

  onDragEndHandler() {
    this.draggedIndex2 = null;
    this.updateStructuredVariants();
  }

  is_draft: number = 1; // Default to draft
  draftCreated: boolean = false; // Flag to track if draft has been created
  draftId: string | null = null;
  firstKeyPress: boolean = false;

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    this.callAddDraft();
  }

  private callAddDraft(): void {
    if (!this.firstKeyPress && !this.productId) {
      this.addDraft();
      this.firstKeyPress = true;
    }
  }

  private addDraft(): void {
    const formData = this.createFormData();
    formData.append('is_draft', String(this.is_draft));

    this._productService.add(formData).subscribe((res: any) => {
      if (res && res.data) {
        this.draftCreated = true;
        this.draftId = res.data.id;
        console.log('Draft added:', res);
      }
    });
  }

  private updateDraft(): void {
    if (this.draftCreated && this.draftId) {
      const formData = this.createFormData();
      formData.append('is_draft', String(this.is_draft));

      this._productService.update(this.draftId, formData).subscribe((res) => {
        console.log('Draft updated:', res);
      });
    }
  }

  dropdownSettings = {};

  onItemSelect(item: any) {
    this.selectedLocationIds.push(item.id); // Push the selected ID
    console.log('Selected IDs:', this.selectedLocationIds);
  }

  onItemDeSelect(item: any) {
    this.selectedLocationIds = this.selectedLocationIds.filter(
      (id: any) => id !== item.id
    ); // Remove the deselected ID
    console.log('Selected IDs after deselect:', this.selectedLocationIds);
  }
}
