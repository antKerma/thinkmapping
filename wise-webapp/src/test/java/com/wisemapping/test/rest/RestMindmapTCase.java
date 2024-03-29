package com.wisemapping.test.rest;


import com.wisemapping.exceptions.WiseMappingException;
import com.wisemapping.rest.model.RestMindmapInfo;
import com.wisemapping.rest.model.RestMindmap;
import com.wisemapping.rest.model.RestMindmapList;
import com.wisemapping.rest.model.RestUser;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.fail;

@Test
public class RestMindmapTCase {

    private String userEmail = "admin@wisemapping.com";
    private static final String HOST_PORT = "http://localhost:8080";
    private static final String BASE_REST_URL = HOST_PORT + "/service";

    @BeforeClass
    void createUser() {

        final RestAdminITCase restAdminITCase = new RestAdminITCase();
        userEmail = restAdminITCase.createNewUser(MediaType.APPLICATION_JSON);
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void listMaps(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title1 = "List Maps 1  - " + mediaType.toString();
        addNewMap(requestHeaders, template, title1);

        final String title2 = "List Maps 2 - " + mediaType.toString();
        addNewMap(requestHeaders, template, title2);

        // Check that the map has been created ...
        final HttpEntity findMapEntity = new HttpEntity(requestHeaders);
        final ResponseEntity<RestMindmapList> response = template.exchange(BASE_REST_URL + "/maps", HttpMethod.GET, findMapEntity, RestMindmapList.class);

        // Validate that the two maps are there ...
        final RestMindmapList body = response.getBody();
        final List<RestMindmapInfo> mindmaps = body.getMindmapsInfo();

        boolean found1 = false;
        boolean found2 = false;
        for (RestMindmapInfo mindmap : mindmaps) {
            if (mindmap.getTitle().equals(title1)) {
                found1 = true;
            }
            if (mindmap.getTitle().equals(title2)) {
                found2 = true;
            }
        }
        assertTrue(found1 && found2, "Map could not be found");
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void deleteMap(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title1 = "Map to delete  - " + mediaType.toString();
        final URI resourceUri = addNewMap(requestHeaders, template, title1);

        // Now remove it ...
        template.delete(HOST_PORT + resourceUri.toString());

        // Check that has been removed ...
        try {
            findMap(requestHeaders, template, resourceUri);
            fail("Map could not be removed:" + resourceUri);
        } catch (Exception e) {
        }
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void changeMapTitle(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final URI resourceUri = addNewMap(requestHeaders, template, "Map to change title  - " + mediaType.toString());

        // Change map title ...
        requestHeaders.setContentType(MediaType.TEXT_PLAIN);
        final String newTitle = "New map to change title  - " + mediaType.toString();
        final HttpEntity<String> updateEntity = new HttpEntity<String>(newTitle, requestHeaders);
        template.put(HOST_PORT + resourceUri + "/title", updateEntity);

        // Load map again ..
        final RestMindmap map = findMap(requestHeaders, template, resourceUri);
        assertEquals(newTitle, map.getTitle());
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void validateMapsCreation(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title = "Map to change title  - " + mediaType.toString();
        final URI resourceUri = addNewMap(requestHeaders, template, title);

        // Try to create a map with the same title ..
        final RestMindmap restMindmap = new RestMindmap();
        restMindmap.setTitle(title);
        restMindmap.setDescription("My Map Desc");

        try {
            HttpEntity<RestMindmap> createUserEntity = new HttpEntity<RestMindmap>(restMindmap, requestHeaders);
            template.postForLocation(BASE_REST_URL + "/maps", createUserEntity);
        } catch (HttpClientErrorException cause) {
            final String responseBodyAsString = cause.getResponseBodyAsString();
            assert(responseBodyAsString.contains("Map name already exists."));
            return;
        }
        fail("Wrong response");

    }


    @Test(dataProvider = "ContentType-Provider-Function")
    public void changeMapDescription(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final URI resourceUri = addNewMap(requestHeaders, template, "Map to change title  - " + mediaType.toString());

        // Change map title ...
        requestHeaders.setContentType(MediaType.TEXT_PLAIN);
        final String newDescription = "New map to change title  - " + mediaType.toString();
        final HttpEntity<String> updateEntity = new HttpEntity<String>(newDescription, requestHeaders);
        template.put(HOST_PORT + resourceUri + "/description", updateEntity);

        // Load map again ..
        final RestMindmap map = findMap(requestHeaders, template, resourceUri);
        assertEquals(newDescription, map.getDescription());
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void updateMapXml(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title = "Update XML sample " + mediaType.toString();
        final URI resourceUri = addNewMap(requestHeaders, template, title);

        // Update map xml content ...
        final String resourceUrl = HOST_PORT + resourceUri.toString();
        requestHeaders.setContentType(MediaType.APPLICATION_XML);
        final String newXmlContent = "<map>this is not valid</map>";
        HttpEntity<String> updateEntity = new HttpEntity<String>(newXmlContent, requestHeaders);
        template.put(resourceUrl + "/xml", updateEntity);

        // Check that the map has been updated ...
        final RestMindmap response = findMap(requestHeaders, template, resourceUri);
        assertEquals(response.getXml(), newXmlContent);
    }

    @Test(dataProvider = "ContentType-Provider-Function")
    public void cloneMap(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title = "Map to clone  sample " + mediaType.toString();
        final String xml = "<map><node text='this is a cloned map'></map>";
        final URI newMapUri = addNewMap(requestHeaders, template, title, xml);

        // Clone map ...
        final RestMindmapInfo restMindmap = new RestMindmapInfo();
        restMindmap.setTitle("Cloned map but with previous content." + mediaType.toString());
        restMindmap.setDescription("Cloned map desc");

        // Create a new map ...
        final HttpEntity<RestMindmapInfo> cloneEntity = new HttpEntity<RestMindmapInfo>(restMindmap, requestHeaders);
        final URI clonedMapUri = template.postForLocation(HOST_PORT + newMapUri, cloneEntity);

        // Check that the map has been updated ...
        final RestMindmap response = findMap(requestHeaders, template, clonedMapUri);
        assertEquals(response.getXml(), xml);
    }


    @Test(dataProvider = "ContentType-Provider-Function")
    public void updateMap(final @NotNull MediaType mediaType) throws IOException, WiseMappingException {    // Configure media types ...
        final HttpHeaders requestHeaders = createHeaders(mediaType);
        final RestTemplate template = createTemplate();

        // Create a sample map ...
        final String title = "Update sample " + mediaType.toString();
        final URI resourceUri = addNewMap(requestHeaders, template, title);

        // Build map to update ...
        final RestMindmap mapToUpdate = new RestMindmap();
        mapToUpdate.setXml("<map>this is not valid</map>");
        mapToUpdate.setProperties("{zoom:x}");

        // Update map ...
        final String resourceUrl = HOST_PORT + resourceUri.toString() + "/document";
        requestHeaders.setContentType(MediaType.APPLICATION_XML);
        final HttpEntity<RestMindmap> updateEntity = new HttpEntity<RestMindmap>(mapToUpdate, requestHeaders);
        template.put(resourceUrl, updateEntity);

        // Check that the map has been updated ...
        HttpEntity<RestUser> findMapEntity = new HttpEntity<RestUser>(requestHeaders);
        final ResponseEntity<RestMindmap> response = template.exchange(HOST_PORT + resourceUri.toString(), HttpMethod.GET, findMapEntity, RestMindmap.class);
        assertEquals(response.getBody().getXml(), mapToUpdate.getXml());
        assertEquals(response.getBody().getProperties(), mapToUpdate.getProperties());
    }

    private RestMindmap findMap(HttpHeaders requestHeaders, RestTemplate template, URI resourceUri) {
        final HttpEntity findMapEntity = new HttpEntity(requestHeaders);
        final ResponseEntity<RestMindmap> response = template.exchange(HOST_PORT + resourceUri.toString(), HttpMethod.GET, findMapEntity, RestMindmap.class);
        return response.getBody();
    }

    private URI addNewMap(@NotNull HttpHeaders requestHeaders, @NotNull RestTemplate template, @NotNull String title, @Nullable String xml) throws IOException, WiseMappingException {
        final RestMindmap restMindmap = new RestMindmap();
        restMindmap.setTitle(title);
        restMindmap.setDescription("My Map Desc");
        if (xml != null) {
            restMindmap.setXml(xml);
        }

        // Create a new map ...
        HttpEntity<RestMindmap> createUserEntity = new HttpEntity<RestMindmap>(restMindmap, requestHeaders);
        return template.postForLocation(BASE_REST_URL + "/maps", createUserEntity);
    }


    private URI addNewMap(@NotNull HttpHeaders requestHeaders, @NotNull RestTemplate template, @NotNull String title) throws IOException, WiseMappingException {
        return addNewMap(requestHeaders, template, title, null);
    }

    private HttpHeaders createHeaders(@NotNull MediaType mediaType) {
        List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
        acceptableMediaTypes.add(mediaType);
        final HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setAccept(acceptableMediaTypes);
        requestHeaders.setContentType(mediaType);
        return requestHeaders;
    }

    private RestTemplate createTemplate() {
        SimpleClientHttpRequestFactory s = new SimpleClientHttpRequestFactory() {
            @Override
            protected void prepareConnection(HttpURLConnection connection, String httpMethod) throws IOException {
                super.prepareConnection(connection, httpMethod);

                //Basic Authentication for Police API
                String authorization = userEmail + ":" + "admin";
                byte[] encodedAuthorisation = Base64.encode(authorization.getBytes());
                connection.setRequestProperty("Authorization", "Basic " + new String(encodedAuthorisation));
            }
        };
        return new RestTemplate(s);
    }

    @DataProvider(name = "ContentType-Provider-Function")
    public Object[][] contentTypes() {
        return new Object[][]{{MediaType.APPLICATION_XML}, {MediaType.APPLICATION_JSON}};
    }
}
