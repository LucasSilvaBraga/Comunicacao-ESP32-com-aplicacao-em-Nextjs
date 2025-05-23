/*
Usado no next.js para indicar esse componente será renderizado no cliente(navegador), e nao no servidor
*/
'use client';

/*
useState: Hook do React para criar e atualizar estados locais
useSocket: um custom hook criado previamente responsavel por gerenciar a conexão com o WebSocket e enviar/receber mensagens
*/
import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

/*
isConnected: booleano que indicar se o socket está conectado
messages: array de mensagens recebidas
sendMessage: funcao que envia uma mensagem para o servidor via WebSocket
inputMessage: controla o que esta sendo digitado no campo de texto
*/
export default function Home() {
  const { isConnected, messages, sendMessage } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  /*
  FUNCAO DE ENVIO
  -E chamada ao enviar o formulário
  -Impede o comportamento padrão do navegador (e.         preventDefault)
  -Se a mensagem não estiver vazia, envia via sendMessage() e limpa o campo de entrada
  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    /* 
    JSX em si (interface do chat)
    */
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">WebSocket Chat Demo</h1>
        <div className={`mb-4 text-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-2">
          {messages.map((msg, index) => (
            <p key={index} className="mb-2">{msg}</p>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border border-gray-300 rounded"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!isConnected}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}