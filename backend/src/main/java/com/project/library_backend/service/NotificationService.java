package com.project.library_backend.service;

import com.project.library_backend.entity.AppUser;
import com.project.library_backend.entity.Loan;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.repository.AppUserRepository;
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
    private final AppUserRepository appUserRepository;


    public NotificationService(
            LoanRepository loanRepository,
            EmailService emailService,
            AppUserRepository appUserRepository
    ) {
        this.loanRepository = loanRepository;
        this.emailService = emailService;
        this.appUserRepository = appUserRepository;
    }

    @Transactional
    public void processNotifications() {

        LocalDateTime now = LocalDateTime.now().plusHours(5);

        sendReminders(now);
        sendOverdueNotices(now);
    }

    private void sendReminders(LocalDateTime now) {

        LocalDateTime limit = now.plusDays(2);

        List<Loan> loans = loanRepository.findByStatusAndDueDateBetween(
                LoanStatus.ACTIVE,
                now,
                limit
        );

        for (Loan loan : loans) {

            if (loan.getReminderSentAt() != null) {
                continue;
            }

            emailService.send(
                    loan.getUser().getEmail(),
                    "Recordatorio de devolución",
                    "El libro "
                            + loan.getBook().getTitle()
                            + " debe ser devuelto antes del "
                            + loan.getDueDate()
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

        for (Loan loan : loans) {

            if (!loan.getDueDate().isBefore(now)) {
                continue;
            }

            if (loan.getOverdueNoticeSentAt() != null) {
                System.out.println("Ya enviado");
                continue;
            }

            var user = loan.getUser();

            emailService.send(
                    user.getEmail(),
                    "Préstamo vencido",
                    "El libro "
                            + loan.getBook().getTitle()
                            + " está vencido"
            );

            loan.setStatus(LoanStatus.OVERDUE);

            registerLateReturn(user);

            loan.setOverdueNoticeSentAt(now);

            loanRepository.save(loan);
        }
    }

    private void registerLateReturn(AppUser user) {


        LocalDateTime now = LocalDateTime.now();


        // Si ya pasó la ventana de 90 días
        if (
                user.getLateReturnsResetAt() == null ||
                        user.getLateReturnsResetAt()
                                .isBefore(now)
        ) {

            user.setLateReturns(0);

            user.setLateReturnsResetAt(
                    now.plusDays(90)
            );
        }


        user.setLateReturns(
                user.getLateReturns() + 1
        );


        if (user.getLateReturns() >= 3) {


            user.setBlockedUntil(
                    now.plusWeeks(1)
            );

            emailService.send(
                    user.getEmail(),
                    "Cuenta bloqueada",
                    "Tu cuenta fue bloqueada por alcanzar " + "3 atrasos en los últimos 90 días"
            );


            user.setLateReturns(0);
            user.setLateReturnsResetAt(null);
        }


        appUserRepository.save(user);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void scheduledNotifications() {
        System.out.println("=== SCHEDULER EJECUTANDO ===");
        processNotifications();
    }
}