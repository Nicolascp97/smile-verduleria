import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const AI_TOOLS: Tool[] = [
  {
    name: "buscar_productos",
    description:
      "Busca productos en el catálogo de Smile. Puede buscar por nombre, categoría, o ambos. Devuelve nombre, formato, stock, precio y disponibilidad.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Texto de búsqueda (nombre del producto o palabra clave)",
        },
        categoria: {
          type: "string",
          enum: [
            "verduras",
            "frutas",
            "hierbas",
            "legumbres_granos",
            "huevos",
            "abarrotes",
          ],
          description: "Categoría para filtrar (opcional)",
        },
      },
      required: [],
    },
  },
  {
    name: "agregar_al_carrito",
    description:
      "Agrega uno o más productos al carrito del cliente. Úsala SOLO cuando el cliente confirmó explícitamente qué quiere y en qué cantidad. Requiere haber llamado buscar_productos antes para tener los producto_id correctos.",
    input_schema: {
      type: "object" as const,
      properties: {
        items: {
          type: "array",
          description: "Productos a agregar al carrito",
          items: {
            type: "object",
            properties: {
              producto_id: {
                type: "string",
                description: "UUID exacto del producto (del resultado de buscar_productos)",
              },
              cantidad: {
                type: "number",
                description: "Cantidad a agregar (entero positivo)",
              },
            },
            required: ["producto_id", "cantidad"],
          },
        },
      },
      required: ["items"],
    },
  },
  {
    name: "crear_pedido",
    description:
      "Crea un pedido en el sistema. Usar cuando el cliente confirma su pedido completo.",
    input_schema: {
      type: "object" as const,
      properties: {
        cliente_nombre: {
          type: "string",
          description: "Nombre del cliente",
        },
        cliente_telefono: {
          type: "string",
          description: "Teléfono del cliente",
        },
        cliente_direccion: {
          type: "string",
          description: "Dirección de entrega",
        },
        items: {
          type: "array",
          description: "Lista de productos del pedido",
          items: {
            type: "object",
            properties: {
              producto_id: { type: "string" },
              nombre: { type: "string" },
              formato: { type: "string" },
              cantidad: { type: "number" },
              precio_unit: { type: "number" },
              subtotal: { type: "number" },
            },
            required: [
              "producto_id",
              "nombre",
              "formato",
              "cantidad",
              "precio_unit",
              "subtotal",
            ],
          },
        },
        notas: {
          type: "string",
          description: "Notas adicionales del pedido",
        },
      },
      required: ["cliente_nombre", "cliente_telefono", "items"],
    },
  },
];
