package com.studentmanagement.dto;

import java.util.List;

public class PageResponse<T> {
    private List<T> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public PageResponse(List<T> content, int currentPage, int pageSize, long totalElements, int totalPages) {
        this.content = content;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = currentPage >= totalPages - 1;
    }

    public List<T> getContent() { return content; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
    public boolean isLast() { return last; }
}
