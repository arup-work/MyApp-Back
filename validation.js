export const validationMiddleware = (zodValidationSchema) => {
    return (err,req,res,next) => {
        const response = zodValidationSchema.safeParse(req.body);
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'File size exceeds the limit' });
            }
        }
        if (!response.success) {
            return res.status(400).json({
                message: "invalid data formate",
                response :response.error.errors,
                statusCode:400
            });
        }

        next();
    }
}
