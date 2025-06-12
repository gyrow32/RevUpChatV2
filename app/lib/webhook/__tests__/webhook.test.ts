import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebhookClient } from '../client';
import { parseWebhookResponse } from '../parser';
import { GalleryBlock, TableBlock, TextBlock } from '../../../lib/types';
import { WebhookRequest, WebhookResponse } from '../../../lib/types';

describe('Webhook Client and Parser', () => {
  let client: WebhookClient;

  beforeEach(() => {
    client = new WebhookClient('http://localhost:3000');
  });

  describe('parseWebhookResponse', () => {
    it('should parse gallery response with markdown format', () => {
      const response = {
        output: 'Here is a gallery of vehicles:\n\n```json\n{\n  "type": "gallery",\n  "vehicles": [\n    {\n      "id": "1",\n      "make": "Toyota",\n      "model": "Camry",\n      "year": 2022,\n      "price": 25000,\n      "image": "https://example.com/camry.jpg"\n    }\n  ]\n}\n```'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('gallery');
      const galleryBlock = result.blocks[0] as GalleryBlock;
      expect(galleryBlock.vehicles).toHaveLength(1);
      expect(galleryBlock.vehicles[0].make).toBe('Toyota');
    });

    it('should parse table response', () => {
      const response = {
        output: '```json\n{\n  "type": "table",\n  "columns": ["Make", "Model", "Price"],\n  "rows": [\n    ["Toyota", "Camry", "$25,000"],\n    ["Honda", "Accord", "$24,000"]\n  ]\n}\n```'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('table');
      const tableBlock = result.blocks[0] as TableBlock;
      expect(tableBlock.columns).toEqual(['Make', 'Model', 'Price']);
      expect(tableBlock.rows).toHaveLength(2);
    });

    it('should parse text response', () => {
      const response = {
        output: '```json\n{\n  "type": "text",\n  "message": "Here are some vehicles that match your criteria."\n}\n```'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('text');
      const textBlock = result.blocks[0] as TextBlock;
      expect(textBlock.content).toBe('Here are some vehicles that match your criteria.');
    });

    it('should handle mixed content with text and gallery', () => {
      const response = {
        output: 'Here are some vehicles that match your criteria:\n\n```json\n{\n  "type": "gallery",\n  "vehicles": [\n    {\n      "id": "1",\n      "make": "Toyota",\n      "model": "Camry",\n      "year": 2022,\n      "price": 25000,\n      "image": "https://example.com/camry.jpg"\n    }\n  ]\n}\n```'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].type).toBe('gallery');
      expect(result.blocks[1].type).toBe('text');
    });

    it('should handle direct text responses', () => {
      const response = {
        output: 'I understand you are looking for a Toyota Camry.'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('text');
      const textBlock = result.blocks[0] as TextBlock;
      expect(textBlock.content).toBe('I understand you are looking for a Toyota Camry.');
    });

    it('should handle legacy blocks format', () => {
      const response = {
        output: '```json\n{\n  "blocks": [\n    {\n      "type": "text",\n      "content": "Here are your results"\n    },\n    {\n      "type": "gallery",\n      "vehicles": []\n    }\n  ]\n}\n```'
      };

      const result = parseWebhookResponse(response);
      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].type).toBe('text');
      expect(result.blocks[1].type).toBe('gallery');
    });

    it('should parse text response correctly', () => {
      const mockResponse = {
        output: '```json\n{"type": "text", "message": "Hello world"}\n```'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'text',
            content: 'Hello world'
          }
        ]
      });
    });

    it('should handle invalid JSON gracefully', () => {
      const mockResponse = {
        output: '```json\ninvalid json\n```'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'text',
            content: 'I apologize, but I encountered an error processing your request. Please try again.'
          }
        ]
      });
    });

      it('should handle missing output field', () => {
    const mockResponse = {} as { output: string };

    const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'text',
            content: 'I apologize, but I encountered an error processing your request. Please try again.'
          }
        ]
      });
    });

    it('should handle non-JSON response', () => {
      const mockResponse = {
        output: 'Plain text response'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'text',
            content: 'Plain text response'
          }
        ]
      });
    });

    it('should handle gallery type response', () => {
      const mockResponse = {
        output: '```json\n{"type": "gallery", "vehicles": [{"id": "1", "make": "Toyota"}]}\n```'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'gallery',
            vehicles: [{"id": "1", "make": "Toyota"}]
          }
        ]
      });
    });

    it('should handle table type response', () => {
      const mockResponse = {
        output: '```json\n{"type": "table", "columns": ["Make", "Model"], "rows": [["Toyota", "Camry"]]}\n```'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'table',
            columns: ["Make", "Model"],
            rows: [["Toyota", "Camry"]]
          }
        ]
      });
    });

    it('should handle questions type response', () => {
      const mockResponse = {
        output: '```json\n{"type": "questions", "questions": ["What is your budget?", "What type of vehicle?"]}\n```'
      };

      const result = parseWebhookResponse(mockResponse);

      expect(result).toEqual({
        blocks: [
          {
            type: 'questions',
            content: ["What is your budget?", "What type of vehicle?"]
          }
        ]
      });
    });

    it('should parse a valid webhook response', () => {
      const response: WebhookResponse = {
        output: JSON.stringify({
          blocks: [
            {
              type: 'text',
              content: 'Test message'
            } as TextBlock
          ]
        })
      };

      const result = parseWebhookResponse(response);
      expect(result).toBeDefined();
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('text');
      expect((result.blocks[0] as TextBlock).content).toBe('Test message');
    });

    it('should handle invalid JSON in output', () => {
      const response: WebhookResponse = {
        output: 'invalid json'
      };

      const result = parseWebhookResponse(response);
      expect(result).toBeDefined();
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('text');
      expect((result.blocks[0] as TextBlock).content).toBe('invalid json');
    });

    it('should handle missing blocks in parsed JSON', () => {
      const response: WebhookResponse = {
        output: JSON.stringify({})
      };

      const result = parseWebhookResponse(response);
      expect(result).toBeDefined();
      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].type).toBe('text');
      expect((result.blocks[0] as TextBlock).content).toBe('{}');
    });
  });

  describe('WebhookClient', () => {
    it('should handle successful message sending', async () => {
      const mockResponse = {
        output: '```json\n{\n  "type": "text",\n  "message": "Message received"\n}\n```'
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await client.sendMessage({
        message: 'Hello',
        sessionId: 'test-session'
      });

      expect(result.success).toBe(true);
      expect(result.data?.blocks).toHaveLength(1);
      expect(result.data?.blocks[0].type).toBe('text');
    });

    it('should handle API errors', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error: 'Invalid request' })
      } as Response);

      const result = await client.sendMessage({
        message: 'Hello',
        sessionId: 'test-session'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid request');
    });

    it('should handle network errors', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const result = await client.sendMessage({
        message: 'Hello',
        sessionId: 'test-session'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });
}); 