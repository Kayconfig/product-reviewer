import concurrently from 'concurrently';

concurrently([
    {
        name: 'client',
        command: 'bun dev',
        cwd: 'packages/client',
        prefixColor: 'cyan',
    },
    {
        name: 'server',
        command: 'bun --inspect index.ts',
        cwd: 'packages/server',
        prefixColor: 'green',
    },
]);
