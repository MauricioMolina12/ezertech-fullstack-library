package com.project.library_backend.service;

import com.project.library_backend.entity.Loan;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.repository.LoanRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final LoanRepository loanRepository;
    private final EmailService emailService;


    public NotificationService(
            LoanRepository loanRepository,
            EmailService emailService
    ) {
        this.loanRepository = loanRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void processNotifications() {

        LocalDateTime now = LocalDateTime.now().plusHours(5);

        sendReminders(now);
        sendOverdueNotices(now);
    }

    private void sendReminders(LocalDateTime now) {

        LocalDateTime tomorrow = now.plusHours(24);

        List<Loan> loans = loanRepository.findByStatusAndDueDateBetween(
                com.project.library_backend.enums.LoanStatus.ACTIVE,
                now,
                tomorrow
        );

        for (Loan loan : loans) {

            if (loan.getReminderSentAt() != null) {
                continue;
            }

            System.out.println(
                    "REMINDER: El préstamo " + loan.getId()
                            + " del usuario " + loan.getUser().getEmail()
                            + " vence el " + loan.getDueDate()
            );

            loan.setReminderSentAt(now);

            loanRepository.save(loan);
        }
    }

    private void sendOverdueNotices(LocalDateTime now) {

        List<Loan> loans = loanRepository.findByStatusAndDueDateBefore(
                LoanStatus.ACTIVE,
                now
        );

        System.out.println("Préstamos vencidos encontrados: " + loans.size());

        for (Loan loan : loans) {

            if (loan.getOverdueNoticeSentAt() != null) {
                System.out.println("Ya enviado");
                continue;
            }

            emailService.send(
                    loan.getUser().getEmail(),
                    "Préstamo vencido",
                    "El libro " + loan.getBook().getTitle() + " está vencido"
            );

            System.out.println("Correo enviado");

            loan.setOverdueNoticeSentAt(now);
            loanRepository.save(loan);
        }
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void scheduledNotifications() {
        System.out.println("=== SCHEDULER EJECUTANDO ===");
        processNotifications();
    }
}