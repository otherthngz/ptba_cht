export function useDashboardPage() {
    const pageTitle = inject('pageTitle', ref(''))
    const showToolbar = inject('showToolbar', ref(false))

    function setPageTitle(title: string) {
        if (isRef(pageTitle)) pageTitle.value = title
    }

    function enableToolbar() {
        if (isRef(showToolbar)) showToolbar.value = true
    }

    function disableToolbar() {
        if (isRef(showToolbar)) showToolbar.value = false
    }

    return { pageTitle, showToolbar, setPageTitle, enableToolbar, disableToolbar }
}
