const isDocumentRegistered = require('../utils/isDocumentRegistered');

class ActivityController {
    #collection;

    constructor() {
        this.#collection = "activities";
    }

    async adicionar(req, res) {
        const { db, body } = req;
        const {
            type,
            subject_code,
            description,
            date,
            value
        } = body;

        const isMissingField = !type || !subject_code || !description || !date || !value;

        if (isMissingField) {
            return res.status(400).json({ message: "Alguma informação está faltando. Campos obrigatórios: type, subject_code, description, date, value" });
        } else {
            try {
                const doc = {
                    "type": type,
                    "subject_code": subject_code,
                    "description": description,
                    "date": date,
                    "value": value
                };

                const subjectExists = await isDocumentRegistered(db.collection("subjects", subject_code));

                const result = await db.collection(this.#collection).insertOne(doc);

                if (!subjectExists) {
                    return res.status(400).json({ message: "Esta matéria não existe" });
                }

                if (!result.insertedId) {
                    return res.status(304).json({ message: "Não foi possível registrar atividade" });
                }

                return res.status(200).json({ message: "Atividade registrada com sucesso!" });
            } catch (e) {
                console.error(e);

                return res.status(500).json({ message: "Não foi possível registrar atividade " });
            }
        }
    }

    async listar(req, res) {
        const { db } = req;

        try {
            const agg = [
                {
                    "$lookup": {
                        "from": "subjects",
                        "localField": "subject_code",
                        "foreignField": "code",
                        "as": "subject"
                    }
                }
            ];

            const result = await db.collection(this.#collection).aggregate(agg).toArray();

            if (result.length === 0) {
                return res.status(400).json({ message: "Nenhum resultado encontrado" });
            }

            return res.status(200).json({ activities: result });
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
            const result = await db.collection(this.#collection).findOne(query).toArray();

            if (result.length === 0) {
                return res.status(400).json({ message: "Nenhum resultado encontrado" });
            }

            return res.status(200).json({ activities: result });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Não foi possível realizar busca" });
        }
    }

    async atualizar(req, res) {
        const { db, body } = req;
        const { updateFields, query } = body;

        if (!query) {
            return res.status(400).json({ message: "query faltando " });
        } else if (!updateFields) {
            return res.status(400).json({ message: "updateFields faltando" });
        }

        try {
            const isAlreadyRegisteredResult = await isDocumentRegistered(db.collection(this.#collection), query);

            if (isAlreadyRegisteredResult) {
                let updateDocument = {
                    $set: {}
                };

                updateFields.forEach((updateField) => {
                    updateDocument.$set[updateField.key] = updateField.newValue;
                });

                const result = await db.collection(this.#collection).updateMany(body.query, updateDocument);

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

module.exports = ActivityController;