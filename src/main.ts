import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';
import { handleIngest } from './lib/ingest/ingest';

handleIngest(window.location.search);

const app = mount(App, {
  target: document.getElementById('app')!
});

export default app;
