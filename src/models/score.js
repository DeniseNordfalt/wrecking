import {model, schema} from 'mongoose';

const scoreSchema = new schema({
    score: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const Score = model('Score', scoreSchema);

export default Score;