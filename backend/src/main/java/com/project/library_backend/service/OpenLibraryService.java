package com.project.library_backend.service;

import com.project.library_backend.dto.book.ExternalBookData;
import com.project.library_backend.dto.book.OpenLibrarySearchResponse;
import io.netty.channel.ChannelOption;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.Optional;

@Service
public class OpenLibraryService {

    private final WebClient webClient;

    public OpenLibraryService(WebClient.Builder webClientBuilder) {

        HttpClient httpClient = HttpClient.create()
                .followRedirect(true)
                .option(
                        ChannelOption.CONNECT_TIMEOUT_MILLIS,
                        10000
                );

        this.webClient = webClientBuilder
                .baseUrl("https://openlibrary.org")
                .clientConnector(
                        new ReactorClientHttpConnector(httpClient)
                )
                .build();
    }

    @Cacheable(
            cacheNames = "openLibraryLookup",
            key = "#isbn"
    )
    public Optional<ExternalBookData> lookupByIsbn(String isbn) {

        System.out.println("LOOKUP ISBN: " + isbn);

        try {

            System.out.println(
                    "CALLING OPEN LIBRARY: https://openlibrary.org/search.json?isbn="
                            + isbn
            );

            OpenLibrarySearchResponse response = webClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search.json")
                            .queryParam("isbn", isbn)
                            .build())
                    .retrieve()
                    .bodyToMono(OpenLibrarySearchResponse.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            System.out.println("OPEN LIBRARY RESPONSE RECEIVED");

            if (response == null
                    || response.getDocs() == null
                    || response.getDocs().isEmpty()) {

                System.out.println(
                        "No book found in Open Library for ISBN: " + isbn
                );

                return Optional.empty();
            }

            OpenLibrarySearchResponse.BookDoc book =
                    response.getDocs().get(0);

            String author = null;

            if (book.getAuthorName() != null
                    && !book.getAuthorName().isEmpty()) {

                author = book.getAuthorName().get(0);
            }

            String coverUrl =
                    "https://covers.openlibrary.org/b/isbn/"
                            + isbn
                            + "-L.jpg";

            ExternalBookData externalBookData =
                    new ExternalBookData(
                            isbn,
                            book.getTitle(),
                            author,
                            book.getFirstPublishYear(),
                            coverUrl
                    );

            System.out.println(
                    "Open Library book found: "
                            + book.getTitle()
            );

            return Optional.of(externalBookData);

        } catch (Exception exception) {

            System.out.println(
                    "Open Library lookup failed for ISBN "
                            + isbn
                            + ": "
                            + exception.getMessage()
            );

            return Optional.empty();
        }
    }
}