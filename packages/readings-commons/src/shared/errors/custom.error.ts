export class CustomError implements Error  {
    constructor(public name: string,
        public message: string,
        public stack?: string) {
    }
}