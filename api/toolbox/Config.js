
class Config
{
    constructor(config)
    {
        Object.entries(config).forEach(a =>
            {
                this[a[0]] = a[1];
            })
        

        if (!this.modelsPath)
        {
            console.warn("router path missing");
            this.modelsPath = "@models/";
        }

        
    }

}

module.exports = Config