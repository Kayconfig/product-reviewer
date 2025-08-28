import { ChatOllama } from '@langchain/ollama';
import { ENV_KEYS } from '../env/env-keys';
import { getSecretOrthrow } from '../env/get-secret';

export function getOllamaLLM(preferredModel?: string): ChatOllama {
    const model = preferredModel ?? getSecretOrthrow(ENV_KEYS.OLLAMA_MODEL);
    return new ChatOllama({ model, temperature: 0.2 });
}
