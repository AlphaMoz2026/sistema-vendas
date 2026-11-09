// Grava a notificação no banco de dados
await sql`
        INSERT INTO notifications (title, message) 
        VALUES (
          'Nova Entrada de Caixa', 
          ${'O funcionário ' + funcionario.full_name + ' entregou um total de ' + totalDinheiro.toLocaleString('pt-MZ') + ' MZN. Dirija-se ao caixa para receber.'}
        )
      `;