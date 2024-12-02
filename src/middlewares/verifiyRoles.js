const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ success: false, message: 'unauthorized' });
        const roles = req.roles;
        const rolesLists = [...allowedRoles];

        const result = roles.map(role => rolesLists.includes(role)).find(val => val === true);
        if (!result) return res.status(401).json({ success: false, message: 'unauthorized' });
        next();
    }
}

module.exports = verifyRoles;