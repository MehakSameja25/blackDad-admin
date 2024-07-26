/**
 * @description Represents an interface for an object with paranoid timestamps.
 * @param {string} createdAt - The creation timestamp of the object.
 * @param {string} updatedAt - The last update timestamp of the object.
 * @param {string | null} deletedAt - The deletion timestamp of the object, or null if not deleted.
 * @returns {IParanoid} - An object conforming to the IParanoid interface.
 * @example
 * ```
 * const obj: IParanoid = {
 *   createdAt: "2023-08-01T10:25:00Z",
 *   updatedAt: "2023-08-15T14:30:00Z",
 *   deletedAt: null
 * };
 * ```
 */
export interface IParanoid {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  
  /**
   * @description Represents a configuration interface for properties.
   * @template T - The type to configure properties for. Defaults to unknown.
   * @param {string} [from] - The source property name to map from, if provided.
   * @param {keyof T} to - The target property name to map to.
   * @param {(val: unknown, prop?: keyof T) => unknown} by - The transformation function to apply on the property value.
   * @returns {IPropertiesConfig<T>} - An object conforming to the IPropertiesConfig interface.
   * @example
   * ```
   * const config: IPropertiesConfig<MyType> = {
   *   from: "sourceProperty",
   *   to: "targetProperty",
   *   by: (val, prop) => {
   *     // Transformation logic here
   *     return transformedValue;
   *   }
   * };
   * ```
   */
  export interface IPropertiesConfig<T = unknown, I = T> {
    from?: keyof I;
    to: keyof T;
    by: (val: unknown, prop?: keyof T) => unknown;
  }
  
  /**
   * @description Represents a base model class with serialization and deserialization functionality.
   * @template T - The type of the model.
   * @template I - The interface representing the model's properties.
   * @example
   * ```
   * const model = new BaseModel<MyType>();
   * const input = { foo: 42, bar: "hello" };
   * const properties = ["foo", { from: "sourceProperty", to: "targetProperty" }];
   * 
   * model.deserialize(input, properties); // Deserialize specific properties
   * console.log(model.serialize()); // Serialize the model to JSON
   * ```
   */
  export class BaseModel<T = unknown, I = T> {
    [key: string]: any; // Index signature to allow dynamic property assignment
  
    /**
     * @description Deserializes the input object into the model instance.
     * @param {Partial<I>} input - The partial input object to deserialize into the model.
     * @param {(keyof I | IPropertiesConfig<I>)[]} [properties] - An optional array of property names or configuration objects defining which properties to deserialize.
     * @returns {this} - The model instance after deserialization.
     * @private
     * @function deserializeProperty - Deserializes a specific property of the model.
     * @param {keyof I} prop - The property key to deserialize.
     * @param {any} value - The value to assign to the property.
     * @returns {void} - No return value.
     * @example
     * ```
     * const model = new BaseModel<MyType>();
     * const input = { foo: 42, bar: "hello" };
     * const properties = ["foo", { from: "sourceProperty", to: "targetProperty" }];
     * 
     * model.deserialize(input, properties); // Deserialize specific properties
     * console.log(model); // The model instance with deserialized properties
     * ```
     */
    deserialize(input: Partial<I>, properties?: (keyof I | IPropertiesConfig<T, I>)[]): this {
      if (Array.isArray(properties)) {
        properties.forEach(prop => {
          if (typeof prop === 'string' || typeof prop === 'number') {
            this.deserializeProperty(prop, input[prop]);
          } else {
            const opts = prop as IPropertiesConfig<T, I>;
            const rawVal = input[(opts.from || opts.to) as keyof I];
            this.deserializeProperty(opts.to as any, opts.by ? opts.by(rawVal) : rawVal);
          }
        });
      } else {
        Object.assign(this, input);
      }
  
      return this;
    }
  
    /**
     * @description Serializes the model instance to JSON format.
     * @returns {I} - The serialized representation of the model.
     * @example
     * ```
     * const model = new BaseModel<MyType>();
     * model.foo = 42;
     * model.bar = "hello";
     * 
     * const serialized = model.serialize();
     * console.log(serialized); // The serialized JSON representation of the model
     * ```
     */
    serialize(): I {
      return JSON.parse(JSON.stringify(this));
    }
  
    /**
     * @description Deserializes a specific property of the model.
     * @param {string | number} prop - The property key to deserialize.
     * @param {unknown} value - The value to assign to the property.
     * @returns {void} - No return value.
     * @private
     * @example
     * ```
     * const model = new SomeModel();
     * model.name = "John Doe";
     * 
     * model.deserializeProperty('name', "Jane Smith"); // Update the 'name' property with the new value
     * console.log(model.name); // The updated value of the 'name' property
     * ```
     */
    private deserializeProperty(prop: string | number, value: unknown): void {
      this[prop] = value;
    }
  }
  