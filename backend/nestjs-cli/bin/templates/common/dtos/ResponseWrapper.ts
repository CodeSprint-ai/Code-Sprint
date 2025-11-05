// src/common/dto/response-wrapper.dto.ts

export class ResponseWrapper<T = any> {
    private _data?: T;
    private _error?: any;
    private _message?: string;
    private _devMessage?: string;
    private _httpStatusCode: number = 200;
    private _isSuccess: boolean = true;

    private constructor() { }

    static builder<T = any>() {
        return new ResponseWrapper<T>();
    }

    data(data?: T): this {
        this._data = data;
        return this;
    }

    error(error: any): this {
        this._error = error;
        this._isSuccess = false;
        return this;
    }

    message(message: string): this {
        this._message = message;
        return this;
    }

    devMessage(devMessage?: string): this {
        this._devMessage = devMessage;
        return this;
    }

    httpStatusCode(code: number): this {
        this._httpStatusCode = code;
        return this;
    }

    isSuccess(success: boolean): this {
        this._isSuccess = success;
        return this;
    }

    build(): {
        data?: T;
        error?: any;
        message?: string;
        devMessage?: string;
        httpStatusCode: number;
        isSuccess: boolean;
    } {
        return {
            data: this._data,
            error: this._error,
            message: this._message,
            devMessage: this._devMessage,
            httpStatusCode: this._httpStatusCode,
            isSuccess: this._isSuccess,
        };
    }


    static success<T = any>(data?: T, message = 'Operation successful!'): ReturnType<ResponseWrapper<T>['build']> {
        return ResponseWrapper.builder<T>()
            .data(data)
            .message(message)
            .httpStatusCode(200)
            .isSuccess(true)
            .build();
    }

    static error<T = any>(
        error: any,
        message = 'Operation failed',
        httpStatusCode = 400,
        devMessage?: string,
    ): ReturnType<ResponseWrapper<T>['build']> {
        return ResponseWrapper.builder<T>()
            .error(error)
            .message(message)
            .httpStatusCode(httpStatusCode)
            .isSuccess(false)
            .devMessage(devMessage)
            .build();
    }

}
