import { describe, it, expect } from 'vitest';
import { loadMessages } from '../request'; 

describe('i18n Request Logic', () => {
  
      it('must return a structured message object including the features', async () => {
            const messages = await loadMessages('fr');

            expect(messages).toHaveProperty('common');
            
            expect(messages).toHaveProperty('authentication');
            
            expect(messages.authentication).toHaveProperty('login');
      });

      it('must handle missing features without crashing (Graceful degradation)', async () => {
            const messages = await loadMessages('fr');
            
            expect(messages).toBeDefined();
            expect(typeof messages).toBe('object');
      });
});