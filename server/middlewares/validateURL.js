const validateURL = (req, res, next) => {
    if (!(req.url.startsWith('/api/auth') || req.url.startsWith('/api/recordings'))) {
        return res.status(404).json({ error: 'Not Found' });
    }
    console.log(req.method, req.url);
    next();
}
export default validateURL;