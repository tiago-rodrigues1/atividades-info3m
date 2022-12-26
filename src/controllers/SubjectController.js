const isDocumentRegistered = require('../utils/isDocumentRegistered');

class SubjectController {
    #collection;

    constructor() {
        this.#collection = "subjects";
    }

    async adicionar(req, res) {
        const { db, body } = req;
        const { code, name } = body;

        if (!code || !name) {
            return res.status(400).json({ "message": "code ou name está faltando" });
        } else {
            try {
                const query = {
                    $or: [
                        { "code": code },
                        { "name": name }
                    ]
                };

                const isAlreadyRegisteredResult = await isDocumentRegistered(db.collection(this.#collection), query);

                if (isAlreadyRegisteredResult instanceof Error) {
                    return res.status(500).json({
                        message: "Não foi possível verificar se a matéria está cadastrada",
                        erro: isAlreadyRegisteredResult.message
                    });
                }


                if (isAlreadyRegisteredResult) {
                    return res.status(400).json({ message: "code ou name já existe" });
                } else {
                    const subjectDoc = {
                        "code": code,
                        "name": name
                    };

                    const result = await db.collection(this.#collection).insertOne(subjectDoc);

                    if (!result.insertedId) {
                        return res.status(304).json({ message: "A matéria não foi inserida" });
                    }

                    return res.status(200).json({ message: "Matéria cadastrada com sucesso" });
                }
            } catch (e) {
                console.error(e);

                return res.status(500).json({ message: "Não foi posssível cadastrar esta matéria" });
            }
        }
    }

    async listar(req, res) {
        const { db } = req;

        try {
            const result = await db.collection(this.#collection).find().toArray();

            if (result.length === 0) {
                return res.status(400).json({ message: "Nenhum resultado encontrado" });
            }

            return res.status(200).json({ subjects: result });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Não foi possível realizar listagem" });
        }
    }

    async buscar(req, res) {
        const { db, body } = req;
        const { query } = body;

        if (!query) {
            return res.status(400).json({ message: "query faltando " });
        }

        try {
            const result = await db.collection(this.#collection).find(body.query).toArray();

            if (result.length === 0) {
                return res.status(400).json({ message: "Nenhum resultado encontrado" });
            }

            return res.status(200).json({ subjects: result });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Não foi possível realizar busca" });
        }
    }

    async atualizar(req, res) {
        const { db, body } = req;
        const { newName, query } = body;

        if (!query) {
            return res.status(400).json({ message: "query faltando " });
        } else if (!newName) {
            return res.status(400).json({ message: "newName faltando " });
        }

        try {
            const isAlreadyRegisteredResult = await isDocumentRegistered(db.collection(this.#collection), query);

            if (isAlreadyRegisteredResult) {
                let updateDocument = {
                    $set: {
                        "name": body.newName
                    }
                };

                const result = await db.collection(this.#collection).updateOne(body.query, updateDocument);

                if (result.modifiedCount === 0) {
                    return res.status(304).json({ message: "Não foi possível atualizar" })
                }

                return res.status(200).json({ message: "Matéria atualizada com sucesso!" });
            } else {
                return res.status(400).json({ message: "Esta matéria não está cadastrada" });
            }

        } catch (e) {
            console.error(e);

            return res.status(500).json({ message: "Não foi possível atualizar" });
        }
    }

    async deletar(req, res) {
        const { db, body } = req;
        const { query } = body;

        if (!query) {
            return res.status(400).json({ "message": "query faltando" });
        } else {
            try {
                const isAlreadyRegisteredResult = await isDocumentRegistered(db.collection(this.#collection), query);

                if (isAlreadyRegisteredResult instanceof Error) {
                    return res.status(500).json({
                        message: "Não foi possível verificar se a matéria está cadastrada",
                        erro: isAlreadyRegisteredResult.message
                    });
                }

                if (!isAlreadyRegisteredResult) {
                    return res.status(400).json({ message: "Matéria não encontrada" });
                } else {
                    const result = await db.collection(this.#collection).deleteMany(query);

                    if (!result.deletedCount) {
                        return res.status(304).json({ message: "Nenhuma matéria foi deletada" });
                    }

                    return res.status(200).json({ message: "Delete realizado com sucesso" });
                }
            } catch (e) {
                console.error(e);

                return res.status(500).json({ message: "Não foi posssível deletar esta(s) matéria(s)" });
            }
        }
    }
}

module.exports = SubjectController;