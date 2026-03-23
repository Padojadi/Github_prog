class HttpException extends Error {
	public status: number;
	public details?: string;

	constructor(message: string, status: number, details = '') {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.status = status;
		this.details = details;
	}

	statusCode() {
		return {
			message: this.message,
			status: this.status,
			details: this.details,
		};
	}
}

export default HttpException;
