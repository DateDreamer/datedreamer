# DateDreamer Documentation & Playground

Welcome to the official documentation for the DateDreamer ecosystem.

## Ecosystem Overview

DateDreamer is a multi-framework, headless calendar system.

### Core Architecture
- **`@datedreamer/core`**: The brain. Pure logic, zero DOM.
- **`@datedreamer/theme`**: The skin. Design tokens and CSS variables.
- **`@datedreamer/web-components`**: The body. Standard Web Components.

### Framework Wrappers
- **React**: `useCalendar` hook and `<Calendar />` component.
- **Vue**: `useCalendar` composable and `<Calendar />` component.
- **Angular**: Core service and directive-based implementation.

## Quick Start

### Web Components (Vanilla JS)
```javascript
import 'https://cdn.jsdelivr.net/npm/@datedreamer/web-components/dist/index.js';
const el = document.querySelector('date-dreamer-calendar');
el.setAttribute('dark-mode', '');
```

### React
```jsx
import { Calendar } from '@datedreamer/react';

function App() {
  return <Calendar onChange={(date) => console.log(date)} />;
}
```

### Vue
```vue
<template>
  <Calendar @change="handleDateChange" />
</template>

<script setup>
import { Calendar } from '@datedreamer/vue';
const handleDateChange = (date) => console.log(date);
</script>
```

## Theming
You can override the entire look of the calendar using CSS variables:

```css
date-dreamer-calendar {
  --dd-primary: #ff4757;
  --dd-radius-md: 0px; /* Sharp corners */
}
```
