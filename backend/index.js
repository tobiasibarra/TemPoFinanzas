const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const json2xls = require('json2xls');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const privateKey = 'qwdkjnasafagsasf';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://tobiasibarra:46353512@cluster0.6txgwnu.mongodb.net/proyecto')
    .then(() => console.log('DB connected!'))
    .catch((e) => console.log("DB no connected"));

const userSchema = new mongoose.Schema({
    usuario: String,
    email: String,
    password: String,
    confirmPassword: String
});

const registroSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registroMotivo: String,
    registroIngreso: Number,
    registroGasto: Number,
    registroMedioPago: String,
    registroFecha: Date,
});

const metaSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metaMotivo: String,
    metaObjetivo: Number,
    metaAhorrado: Number,
    metaFecha: Date,
});

const User = mongoose.model('User', userSchema);
const Registro = mongoose.model('Registro', registroSchema);
const Meta = mongoose.model('Meta', metaSchema);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/registro', jsonParser, (req, res) => {
    const { usuario, email, password, confirmPassword } = req.body;

    const createNewUser = new User({
        usuario: usuario,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    });

    createNewUser.save().then((result) => {
        res.status(201).json({ msg: 'Usuario creado correctamente!', result });
    });
});

function generateToken(user) {
    const token = jwt.sign({ userId: user._id }, privateKey, { expiresIn: '1h' });
    return token;
}

app.post('/login', jsonParser, (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then((result) => {
        if (result) {
            if (result.password == password) {
                res.status(200).send({
                    msg: 'Logueado correctamente',
                    result,
                    token: generateToken(result)
                });
            } else {
                res.status(500).send({ msg: 'Por favor, ingrese una contraseña válida!', result });
            }
        } else {
            res.status(500).send({ msg: 'Por favor, ingrese un e-mail válido!', result });
        }
    });
});

const verifyToken = (req, res, next) => {
    const token = req.headers.autorizacion;

    if (!token) {
        return res.status(401).send({ msg: "Acceso denegado" });
    }

    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ msg: "Token inválido" });
        } else {
            req.user = decoded;
            next();
        }
    });
};

app.post('/registros', verifyToken, jsonParser, (req, res) => {
    const { registroMotivo, registroIngreso, registroGasto, registroMedioPago, registroFecha } = req.body;

    const createNewRegistro = new Registro({
        usuarioId: req.user.userId,
        registroMotivo: registroMotivo,
        registroIngreso: registroIngreso,
        registroGasto: registroGasto,
        registroMedioPago: registroMedioPago,
        registroFecha: registroFecha,
    });

    createNewRegistro.save().then((result) => {
        res.status(201).json({ msg: 'Registro creado correctamente!', result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno." });
    });
});

app.get('/registros', verifyToken, (req, res) => {
    Registro.find({ usuarioId: req.user.userId }).then((result) => {
        res.status(200).json(result);
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});


app.put('/registros', verifyToken, jsonParser, (req, res) => {
    const { registroMotivo, registroIngreso, registroGasto, registroMedioPago, registroFecha, _id } = req.body;

    Registro.findOneAndUpdate(
        { _id: _id, usuarioId: req.user.userId },
        {
            $set: {
                registroMotivo: registroMotivo,
                registroIngreso: registroIngreso,
                registroGasto: registroGasto,
                registroMedioPago: registroMedioPago,
                registroFecha: registroFecha,
            }
        },
        { new: true }
    ).then((result) => {
        res.status(201).json({ msg: "Editado correctamente.", result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});

app.delete('/registros/:id', verifyToken, (req, res) => {
    Registro.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.userId }).then((result) => {
        res.status(200).json({ msg: "Item eliminado correctamente.", result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});


app.post('/metas', verifyToken, jsonParser, (req, res) => {
    const { metaMotivo, metaObjetivo, metaAhorrado, metaFecha } = req.body;

    const createNewMeta = new Meta({
        usuarioId: req.user.userId,
        metaMotivo: metaMotivo,
        metaObjetivo: metaObjetivo,
        metaAhorrado: metaAhorrado,
        metaFecha: metaFecha,
    });

    createNewMeta.save().then((result) => {
        res.status(201).json({ msg: 'Meta creada correctamente!', result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno." });
    });
});

app.get('/metas', verifyToken, (req, res) => {
    Meta.find({ usuarioId: req.user.userId }).then((result) => {
        res.status(200).json(result);
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});


app.put('/metas', verifyToken, jsonParser, (req, res) => {
    const { metaMotivo, metaObjetivo, metaAhorrado, metaFecha, _id } = req.body;

    Meta.findOneAndUpdate(
        { _id: _id, usuarioId: req.user.userId },
        {
            $set: {
                metaMotivo: metaMotivo,
                metaObjetivo: metaObjetivo,
                metaAhorrado: metaAhorrado,
                metaFecha: metaFecha,
            }
        },
        { new: true }
    ).then((result) => {
        res.status(201).json({ msg: "Editado correctamente.", result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});

app.delete('/metas/:id', verifyToken, (req, res) => {
    Meta.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.userId }).then((result) => {
        res.status(200).json({ msg: "Item eliminado correctamente.", result });
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});


app.get('/presupuesto', verifyToken, (req, res) => {
    Registro.find({ usuarioId: req.user.userId }).then((result) => {
        res.status(200).json(result);
    }).catch((e) => {
        res.status(500).json({ msg: "Error de servidor interno.", e });
    });
});


const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'tempofinanzas@hotmail.com',
        pass: '46353512To'
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('Error de configuración de Nodemailer:', error);
    } else {
        console.log('El servidor de correo está listo para enviar correos');
    }
});

app.post('/contacto', (req, res) => {
    const { email, asunto, mensaje } = req.body;

    console.log('Datos recibidos:', { email, asunto, mensaje });

    const mailOptions = {
        from: 'tempofinanzas@hotmail.com',
        replyTo: email,
        to: 'tempofinanzas@hotmail.com',
        subject: `Nuevo mensaje de contacto: ${asunto}`, 
        text: `Lo envió: ${email}\n\nAsunto: ${asunto}\n\n\nMensaje:\n\n${mensaje}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando el correo:', error);
            return res.status(500).send({ error: error.toString() });
        }
        console.log('Correo enviado:', info.response);
        res.status(200).json({ message: 'Correo enviado correctamente!' });
    });
});
app.listen(port, () => {
    console.log("Server running on port:", port);
});

console.log("Hola mundo!");
