import { BaseModel } from "./base.model";

export interface IFieldRejection extends BaseModel<IFieldRejection> {
  field: string;
  value: string;
  expected: string | string[];
}

export class FieldRejection extends BaseModel<FieldRejection, IFieldRejection> implements IFieldRejection {
  field!: string;
  value!: string;
  expected!: string | string[];
}

export interface IErrorMessage extends BaseModel<IErrorMessage> {
  message: string;
  statusCode: number;
  rejectedFields?: FieldRejection[];
}

export class ErrorMessage extends BaseModel<ErrorMessage, IErrorMessage> implements IErrorMessage {

  constructor(opts?: Partial<ErrorMessage>) {
    super();
    if (opts) {
      this.deserialize(opts);
    }
  }

  message: string = "Internal Server Error";
  statusCode: number = 500;
  rejectedFields?: FieldRejection[];
  handled?: boolean = false;
}

export interface IAPIErrorOutput extends BaseModel<IAPIErrorOutput> {
  error: ErrorMessage;
}

export class APIErrorOutput extends BaseModel<APIErrorOutput, IAPIErrorOutput> implements IAPIErrorOutput {
  error!: IErrorMessage;

  override deserialize(input: Partial<APIErrorOutput>): this {
    super.deserialize(input);

    if (input.error) {
      this.error = (new ErrorMessage()).deserialize(input.error);
    }

    return this;
  }
}