'use client'

const localStorageItemID = 'nacho:clients'

const saveLocalStorage = (clients: Client[]) => {
  localStorage.setItem(localStorageItemID, JSON.stringify(clients))
}

export const getClients = (): Client[] => {
  const clientAsString = localStorage.getItem(localStorageItemID)
  if (!clientAsString) {
    return []
  }

  try {
    return JSON.parse(clientAsString) as Client[]
  } catch (e) {
    console.error('Error parsing clients', e)
    return []
  }
}

export const getClientById = (id: string): Client | undefined => {
  return getClients().find((c) => c.client.id === id)
}

export const saveClient = (client: Client): Client => {
  const clients = getClients()
  const index = clients.findIndex((c) => c.client.id === client.client.id)
  if (index === -1) {
    clients.push(client)
  } else {
    clients[index] = client
  }
  saveLocalStorage(clients)
  return client
}

export const deleteClient = async (id: string): Promise<void> => {
  const clients = getClients()
  const index = clients.findIndex((c) => c.client.id === id)
  if (index === -1) {
    return
  }
  clients.splice(index, 1)
  saveLocalStorage(clients)
}
