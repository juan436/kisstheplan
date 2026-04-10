export interface FaqItem {
  question: string;
  answer: string;
  videoUrl?: string;
}

export interface FaqModule {
  label: string;
  faqs: FaqItem[];
}

export const FAQ_DATA: FaqModule[] = [
  {
    label: "Lista de invitados",
    faqs: [
      {
        question: "¿Cómo añado un invitado?",
        answer:
          "Puedes añadir invitados de dos formas: usando el botón '+ Añadir invitado' para un formulario completo, o haciendo clic en la fila vacía al final de la tabla para un alta rápida. Pulsa Enter para guardar.",
      },
      {
        question: "¿Cómo importo invitados desde Excel?",
        answer:
          "Pulsa el botón 'Importar Excel'. Primero descarga la plantilla para ver el formato correcto, rellénala y súbela. El sistema creará todos los invitados automáticamente.",
      },
      {
        question: "¿Puedo agrupar invitados por familia o pareja?",
        answer:
          "Sí. Crea un grupo desde el panel lateral y asigna invitados a él. Los grupos te permiten filtrar y gestionar mejor el listado.",
      },
      {
        question: "¿Cómo exporto la lista?",
        answer:
          "Usa los botones 'Exportar Excel' o 'Exportar PDF' en la parte superior de la tabla. El PDF incluye un resumen de alergias y opciones de menú.",
      },
    ],
  },
  {
    label: "Presupuesto",
    faqs: [
      {
        question: "¿Cómo añado una categoría?",
        answer:
          "Pulsa '+ Nueva categoría' al final de la tabla. Escribe el nombre y pulsa Enter para guardarla. Después puedes añadir subcategorías dentro de ella.",
      },
      {
        question: "¿Cómo marco un pago como pagado?",
        answer:
          "En el calendario de pagos, marca el checkbox 'Pagado' de la fila correspondiente. Las columnas de totales se actualizarán automáticamente en el dashboard.",
      },
      {
        question: "¿Puedo editar las celdas directamente?",
        answer:
          "Sí, haz clic en cualquier celda numérica para editarla en línea. Pulsa Enter para guardar o Esc para cancelar.",
      },
    ],
  },
  {
    label: "Tareas",
    faqs: [
      {
        question: "¿Cómo marco una tarea como completada?",
        answer:
          "Marca el checkbox a la izquierda del nombre de la tarea. El porcentaje de progreso del dashboard se actualizará automáticamente.",
      },
      {
        question: "¿Puedo asignar tareas a un colaborador?",
        answer:
          "Sí. En cada tarea, usa el desplegable 'Asignar a' para seleccionar un colaborador. Recibirán una notificación por email.",
      },
      {
        question: "¿Qué son las etapas temporales?",
        answer:
          "Las tareas están agrupadas por etapas: +12 meses, 9–12 meses, 6–8 meses, etc. Son orientativas y puedes mover tareas entre ellas o añadir las tuyas propias.",
      },
    ],
  },
  {
    label: "Web",
    faqs: [
      {
        question: "¿Cómo publico la web de mi boda?",
        answer:
          "Ve al módulo Web y completa los 3 pasos del builder (Diseño, RSVP, Contenido). Cuando estés listo, pulsa 'Publicar web'. La URL será kisstheplan.es/tu-slug.",
      },
      {
        question: "¿Puedo cambiar la URL (slug) de mi boda?",
        answer:
          "Sí, en el paso de publicación puedes editar el slug. El sistema verifica que esté disponible y lo actualiza en tiempo real.",
      },
      {
        question: "¿Cómo recibo los RSVP de los invitados?",
        answer:
          "Cuando un invitado completa el formulario de la web, su estado se actualiza automáticamente en la lista de invitados. Verás los cambios reflejados en el dashboard.",
      },
    ],
  },
  {
    label: "Proveedores",
    faqs: [
      {
        question: "¿Cómo añado un proveedor?",
        answer:
          "Pulsa '+ Añadir proveedor' en la vista de tarjetas. Introduce nombre, categoría y estado (Confirmado / Considerando). Después puedes completar la ficha con todos los detalles.",
      },
      {
        question: "¿Puedo adjuntar contratos?",
        answer:
          "Sí. En la ficha del proveedor, sección 'Contrato firmado', sube el PDF directamente. Quedará guardado y accesible desde ahí.",
      },
      {
        question: "¿El calendario de pagos es compartido con Presupuesto?",
        answer:
          "Exacto. Los pagos que vinculas a un proveedor aparecen tanto en su ficha como en el módulo de Presupuesto y en los próximos pagos del dashboard.",
      },
    ],
  },
  {
    label: "Plano de mesas",
    faqs: [
      {
        question: "¿Cómo creo una mesa?",
        answer:
          "En la vista Canvas, usa las herramientas del panel derecho para añadir una mesa redonda o rectangular. Arrástrala a la posición deseada y haz clic para asignar invitados.",
      },
      {
        question: "¿Puedo subir el plano del espacio?",
        answer:
          "Sí. Usa el botón 'Subir imagen de fondo'. Si introduces dos puntos de referencia y la distancia real entre ellos, el sistema calcula la escala automáticamente.",
      },
      {
        question: "¿Puedo tener varios planos?",
        answer:
          "Sí, puedes crear planos independientes para cada momento: aperitivo, cena, fiesta, etc.",
      },
    ],
  },
  {
    label: "Calendario",
    faqs: [
      {
        question: "¿Cómo añado un evento al calendario?",
        answer:
          "Haz clic en cualquier día del calendario y selecciona 'Nuevo evento'. También puedes añadir tareas con fecha desde el módulo Tareas y aparecerán automáticamente.",
      },
      {
        question: "¿Puedo sincronizar con Google Calendar?",
        answer:
          "Sí. En el módulo Calendario, copia el enlace de sincronización (.ics) y pégalo en Google Calendar, Apple Calendar o Outlook.",
      },
    ],
  },
  {
    label: "Guión",
    faqs: [
      {
        question: "¿Cómo funciona el guión del día?",
        answer:
          "El módulo Guión es un timeline editable con las horas del día. Puedes añadir, eliminar y reordenar líneas arrastrándolas. Hay una plantilla predefinida de boda española que puedes adaptar.",
      },
      {
        question: "¿Puedo exportar el guión a PDF?",
        answer:
          "Sí, pulsa 'Exportar PDF' desde la vista detallada. El PDF incluye el timeline formateado con horas y descripciones.",
      },
    ],
  },
  {
    label: "Notas",
    faqs: [
      {
        question: "¿Qué tipos de notas puedo crear?",
        answer:
          "Puedes crear tres tipos: texto enriquecido (estilo Word con imágenes y tablas), PDF adjunto (visualizable inline), y moodboard (imágenes por categorías + paleta de colores).",
      },
      {
        question: "¿Puedo asociar una nota a un proveedor?",
        answer:
          "Sí. Al crear o editar una nota, selecciona el proveedor en el desplegable 'Asociar a proveedor'. La nota aparecerá también en la ficha de ese proveedor.",
      },
    ],
  },
];
