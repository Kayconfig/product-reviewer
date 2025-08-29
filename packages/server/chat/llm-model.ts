import { ChatOllama } from '@langchain/ollama';
import { ENV_KEYS } from '../env/env-keys';
import { getSecretOrthrow } from '../env/get-secret';

type Options = {
    modelName?: string;
    temperature?: number;
    maxOutputTokens?: number;
};

export function getOllamaLLM(opts?: Options): ChatOllama {
    const model = opts?.modelName ?? getSecretOrthrow(ENV_KEYS.OLLAMA_MODEL);
    let temperature = opts?.temperature;
    if (
        temperature === null ||
        temperature === undefined ||
        isNaN(temperature)
    ) {
        temperature = 0.2;
    }

    return new ChatOllama({
        model,
        temperature,
        numPredict: opts?.maxOutputTokens,
    });
}
