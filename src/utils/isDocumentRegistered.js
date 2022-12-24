async function isDocumentRegistered(dbCollection, query) {
    try {
        const isRegistered = await dbCollection.countDocuments(query) !== 0;

        return isRegistered;
    } catch (e) {
        return new Error(e.message);
    }
}

module.exports = isDocumentRegistered;