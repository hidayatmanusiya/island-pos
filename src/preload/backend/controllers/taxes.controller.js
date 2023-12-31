import {Taxes} from "../models/taxes.model.js"

export const addTax = async (taxName, taxRate, type) => {
    const res = await Taxes.create({name: taxName, taxRate: taxRate, type: type});
    return res;
};

export const getTaxes = async ()=> {
    const res = await Taxes.findAll();
    return res;
}

export const removeTax = async (id) => {
    const res = await Taxes.destroy({
        where: {
            id
        }
    })

    return res;
}