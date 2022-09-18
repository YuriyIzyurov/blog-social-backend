import MulterSharpResizer from "multer-sharp-resizer";

export default async (req, res, next) => {

    const filename = `image-${Date.now()}`;

    const sizes = [
        {
            path: "original",
            width: null,
            height: null,
        },
        {
            path: "medium",
            width: 400,
            height: 250,
        },
        {
            path: "small",
            width: 100,
            height: 100,
        },
    ];

    const uploadPath = `uploads`;

    const fileUrl = `${req.protocol}://${req.get(
        "host"
    )}/uploads`;

    // sharp options
    const sharpOptions = {
        fit: "cover",
        background: { r: 255, g: 255, b: 255 },
    };

    // create a new instance of MulterSharpResizer and pass params
    const resizeObj = new MulterSharpResizer(
        req,
        filename,
        sizes,
        uploadPath,
        fileUrl,
        sharpOptions
    );

    // call resize method for resizing files
    await resizeObj.resize();
    req.body.images = resizeObj.getData();

    next();
};